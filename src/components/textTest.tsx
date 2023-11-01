import { childIntegration } from '@/context/editor/childIntegration';
import { spanChild } from '@/context/editor/typography';
import { useEditor } from '@/context/editor/valueEditor';
import { Editor, EditorContentType } from '@/interface/editor';
import { check, cleanUpState, getSelectedElements, nullifyValue } from '@/utils/actions';
import { removedValue } from '@/utils/actions/editor/removedValue';
import { getAllChildren, getChildren, getContent, getContents, getRoot, getRootParentIndex, getRoots, removeChildrenContent, removeContent, removeRoot, updateContents, updateValueContent, upsetContent } from '@/utils/editor';
import { getCurrentlyEditedElement, getNestedArray, removeNestedArray, updateNestedArray, updateNestedArrayContent, } from '@/utils/editors';
import { updateCaretToMatch } from '@/utils/editors/editorData/cursor';
import React, { useEffect, } from 'react'
import { v4 } from 'uuid';

export const TextTest = () => {

    const { editorValue, setEditorValue, renderEditorDom } = useEditor();

    useEffect(() => {
        renderEditorDom();

    }, [])

    let currentPosition: number;
    let id: string;
    let inputKey = "";



    return (
        <div
            id="editor"
            className={` py-2 px-4 outline-none cursor-text block whitespace-pre-wrap break-words select-text `}

            suppressContentEditableWarning={true}
            contentEditable

            onInput={async (event) => {

                let { selection, node } = getCurrentlyEditedElement()
                if (node && selection) {
                    let cartUpdate = true
                    if (node.firstChild.nodeType === 3) {
                        updateValueContent({
                            id: id,
                            value: node.textContent
                        });
                    }
                    else {
                        const parentContent = getContent({ id: node.id })
                        if (!parentContent.parentId) {
                            //TODO: May need a future check
                            check({ node })
                            cartUpdate = false;
                        }

                    }

                    // if (cartUpdate) updateCaretToMatch({ id, currentPosition, selection });
                    // console.log("updatedDataView", updatedDataView);

                }



            }}
            onKeyDown={async (event: React.KeyboardEvent<HTMLDivElement>) => {

                //fetch the node and section
                const { selection, node } = getCurrentlyEditedElement()

                // get the id of the current editable htmlElement
                id = node.id;

                // get the caretPosition of the current editable htmlElement
                currentPosition = selection!.focusOffset;

                // get the imputed text on the current editable htmlElement
                inputKey = event.key;

                // fetch all the selected texts
                const selectedValues = getSelectedElements();

                // if there is a selected text we need to update the variable accordingly 
                if (selectedValues.length > 0) {
                    event.preventDefault();

                    const firstContent = JSON.parse(JSON.stringify(getContent({ id: selectedValues[0].id })))
                    const lastContent = JSON.parse(JSON.stringify(getContent({ id: selectedValues[selectedValues.length - 1].id })))
                    let firstContentIndex = "-1";
                    let lastContentIndex = "-2";
                    if (firstContent && lastContent) {
                        firstContentIndex = getRootParentIndex({ contentValue: firstContent })
                        lastContentIndex = getRootParentIndex({ contentValue: lastContent })
                    }


                    let finalNodeData: any;
                    // loop throw the selected text and remove them and there parent if they have been selected as a whole, 
                    // if they are partially selected they are modified a 
                    selectedValues.map(async (value, index) => {
                        if (value.fullySelected) {
                            await removedValue({ node: value.node })
                        } else {
                            let updatedText = "";
                            let updatedId = value.node.id;
                            if (index === 0) {
                                updatedText = value.wholeText.slice(0, value.startPos);
                                value.node.textContent = updatedText
                                updatedId = value.node.id;
                                finalNodeData = value;
                            }
                            else if (index === selectedValues.length - 1) {
                                updatedText = value.wholeText.slice(value.endPos, value.wholeText.length);
                                value.node.textContent = value.wholeText.slice(value.endPos, value.wholeText.length)
                                if (!finalNodeData) finalNodeData = value;
                            }
                            await updateValueContent({ id: updatedId, value: updatedText })
                        }
                    });


                    if (firstContentIndex != lastContentIndex) {
                        const roots = getRoots();

                        let startDeleting = false;
                        Object.values(roots).map((value, index) => {
                            if (value === lastContentIndex) {
                                startDeleting = false;
                            }
                            if (startDeleting) {
                                const nodeData = document.getElementById(value);
                                nodeData?.remove();
                                removeRoot({ contentId: value })
                                removeContent({ id: value })
                            }
                            if (value === firstContentIndex) {
                                startDeleting = true;
                            }

                        })

                        // check if the last one is being completed deleted

                        // connect the first and last part to make them one data

                        // let firstValue = getNestedArray({ editorState: updatedDataView.editorState.root, indexLevel: [selectedValues[0].indexLevel[0]] });

                        // let lastValue = getNestedArray({ editorState: updatedDataView.editorState.root, indexLevel: [selectedValues[selectedValues.length - 1].indexLevel[0]] });


                        // // cleanUpState({ editorState: updatedDataView.editorState.root, indexLevel: [selectedValues[selectedValues.length - 1].indexLevel[0]] })

                        // console.log("updatedDataView", updatedDataView);

                        // if (lastValue && firstValue) {
                        //     let data: EditorStateChildren;
                        //     if (firstValue.content != null && !firstValue.children) {
                        //         data = {
                        //             id: v4(),
                        //             type: "P",
                        //             className: "",
                        //             direction: "",
                        //             indent: 0,
                        //             content: firstValue.content
                        //         }
                        //         firstValue.children = [data];
                        //         firstValue.content = undefined;
                        //     } else if (firstValue.children) {
                        //         cleanUpState({ editorState: updatedDataView.editorState.root, indexLevel: [selectedValues[0].indexLevel[0]] })
                        //     }
                        //     if (lastValue.content != null && !lastValue.children) {
                        //         data = {
                        //             id: v4(),
                        //             type: "P",
                        //             className: "",
                        //             direction: "",
                        //             indent: 0,
                        //             content: lastValue.content
                        //         }
                        //         lastValue.children = [data];
                        //         lastValue.content = undefined;
                        //     } else if (lastValue.children) {
                        //         cleanUpState({ editorState: updatedDataView.editorState.root, indexLevel: [selectedValues[selectedValues.length - 1].indexLevel[0]] })
                        //     }
                        //     firstValue.children = [...firstValue.children ?? [], ...lastValue.children ?? []]
                        //     firstValue.content = undefined;
                        // } else {

                        // }


                    }
                    console.log("finalNodeData", finalNodeData);
                    if (finalNodeData) {
                        finalNodeData.node.focus();
                        updateCaretToMatch({ currentPosition: finalNodeData.startPos, id: finalNodeData.id, selection: selection! })
                    }
                }




                if (event.code === "Enter") {
                    event.preventDefault();
                }
                else if (event.code === "Tab") {
                    event.preventDefault();
                }
                else if (event.code === "Backspace") {

                    if (selectedValues.length === 0 && node.textContent.length === 1) {
                        // event.preventDefault()
                        // await removedValue({ indexLevel, node, updatedDataView });
                        // setEditorValue(updatedDataView)
                    }

                }

                else if (event.code === "Space") {

                }

                console.log("getContents", getContents())
                console.log("getAllChildren", getAllChildren())

            }}
            onPaste={(event) => {
                event.preventDefault();
            }}
        />

    )
}




