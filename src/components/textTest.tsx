import { childIntegration } from '@/context/editor/childIntegration';
import { spanChild } from '@/context/editor/typography';
import { useEditor } from '@/context/editor/valueEditor';
import { Editor, EditorStateChildren } from '@/interface/editor';
import { check, cleanUpState, getSelectedElements, nullifyValue } from '@/utils/actions';
import { removedValue } from '@/utils/actions/editor/removedValue';
import { getCurrentlyEditedElement, getNestedArray, removeNestedArray, updateNestedArray, updateNestedArrayContent, } from '@/utils/editors';
import { updateCaretToMatch } from '@/utils/editors/editorData/cursor';
import React, { useEffect, } from 'react'
import { v4 } from 'uuid';

export const TextTest = () => {

    const { editorValue, setEditorValue, renderEditorDom } = useEditor();

    useEffect(() => {
        renderEditorDom();

    }, [])

    let indexLevel: number[];
    let currentPosition: number;
    let id: string;
    let inputKey = "";



    return (
        <div
            id="editor"
            className={`py-2 px-4 outline-none cursor-text block whitespace-pre-wrap break-words select-text `}

            suppressContentEditableWarning={true}
            contentEditable

            onInput={async (event) => {
                let { selection, node } = getCurrentlyEditedElement()
                if (node && selection) {

                    // unlink the current data set 
                    let updatedDataView: Editor = JSON.parse(JSON.stringify(editorValue));

                    // console.log("node", id, node)
                    // console.log("lastChild", node.lastChild, node.lastChild.nodeType, node.lastChild.nodeType === 3)

                    // console.log("firstChild", node.firstChild, node.firstChild.nodeType, node.firstChild.nodeType === 3)

                    /**
                     * check if the text input has been moved out of the child text mode 
                     * to the to the parent side
                     * */

                    let cartUpdate = true
                    // update the value of the state based on the input
                    if (node.firstChild.nodeType === 3 && indexLevel != null) {
                        console.log("head");
                        updateNestedArrayContent(
                            {
                                editorState: updatedDataView.editorState.root,
                                indexLevel: [...indexLevel],
                                value: node.textContent
                            }
                        );
                    }
                    else {
                        if (updatedDataView.editorState.root[indexLevel[0]].children) {
                            check({ node, indexLevel, updatedDataView })
                            cartUpdate = false;
                        }

                    }

                    setEditorValue(updatedDataView)
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

                // get the index level of the current editable htmlElement
                indexLevel = JSON.parse(node.getAttribute("data-index-level"))

                // get the imputed text on the current editable htmlElement
                inputKey = event.key;

                // pass the data to a new variable for modification
                let updatedDataView: Editor = JSON.parse(JSON.stringify(editorValue));

                // fetch all the selected texts
                const selectedValues = getSelectedElements();

                // if there is a selected text we need to update the variable accordingly 
                if (selectedValues.length > 0) {
                    event.preventDefault();
                    let finalNodeData: any;

                    // loop throw the selected text and remove them and there parent if they have been selected as a whole, 
                    // if they are partially selected they are modified a 
                    selectedValues.map((value, index) => {
                        if (value.fullySelected) {
                            removedValue({ updatedDataView, indexLevel: [...value.indexLevel], node: value.node })
                        } else {
                            let updatedText = "";
                            if (index === 0) {
                                updatedText = value.wholeText.slice(0, value.startPos);
                                value.node.textContent = updatedText
                                finalNodeData = value;
                            }
                            else if (index === selectedValues.length - 1) {
                                updatedText = value.wholeText.slice(value.endPos, value.wholeText.length);
                                value.node.textContent = value.wholeText.slice(value.endPos, value.wholeText.length)
                                if (!finalNodeData) finalNodeData = value;
                            }
                            updateNestedArrayContent({ editorState: updatedDataView.editorState.root, indexLevel: [...indexLevel], value: updatedText })
                        }
                    });
                    if (finalNodeData) {
                        finalNodeData.node.focus();
                        updateCaretToMatch({ currentPosition: finalNodeData.startPos, id: finalNodeData.id, selection: selection! })
                    }



                    if (selectedValues[0].indexLevel[0] != selectedValues[selectedValues.length - 1].indexLevel[0]) {
                        console.log("on different level");
                        let startIndex = selectedValues[0].indexLevel[0];
                        let endIndex = selectedValues[selectedValues.length - 1].indexLevel[0];

                        for (let indexData = startIndex + 1; indexData < endIndex; indexData++) {
                            if (updatedDataView.editorState.root[indexData]) {
                                if (updatedDataView.editorState.root[indexData].content) updatedDataView.editorState.root[indexData].content = undefined;
                                if (updatedDataView.editorState.root[indexData].children) updatedDataView.editorState.root[indexData].children = undefined;
                                if (updatedDataView.editorState.root[indexData].additional) updatedDataView.editorState.root[indexData].additional = undefined;
                                const nodeData = document.getElementById(updatedDataView.editorState.root[indexData].id);
                                console.log("nodeData", nodeData)
                                nodeData?.remove();
                                nullifyValue({
                                    indexLevel: [indexData],
                                    updatedDataView,
                                })
                            }
                        }

                        // check if the last one is being completed deleted

                        // connect the first and last part to make them one data

                        let firstValue = getNestedArray({ editorState: updatedDataView.editorState.root, indexLevel: [selectedValues[0].indexLevel[0]] });

                        let lastValue = getNestedArray({ editorState: updatedDataView.editorState.root, indexLevel: [selectedValues[selectedValues.length - 1].indexLevel[0]] });


                        // cleanUpState({ editorState: updatedDataView.editorState.root, indexLevel: [selectedValues[selectedValues.length - 1].indexLevel[0]] })

                        console.log("updatedDataView", updatedDataView);

                        if (lastValue && firstValue) {
                            let data: EditorStateChildren;
                            if (firstValue.content != null && !firstValue.children) {
                                data = {
                                    id: v4(),
                                    type: "P",
                                    className: "",
                                    direction: "",
                                    indent: 0,
                                    content: firstValue.content
                                }
                                firstValue.children = [data];
                                firstValue.content = undefined;
                            } else if (firstValue.children) {
                                cleanUpState({ editorState: updatedDataView.editorState.root, indexLevel: [selectedValues[0].indexLevel[0]] })
                            }
                            if (lastValue.content != null && !lastValue.children) {
                                data = {
                                    id: v4(),
                                    type: "P",
                                    className: "",
                                    direction: "",
                                    indent: 0,
                                    content: lastValue.content
                                }
                                lastValue.children = [data];
                                lastValue.content = undefined;
                            } else if (lastValue.children) {
                                cleanUpState({ editorState: updatedDataView.editorState.root, indexLevel: [selectedValues[selectedValues.length - 1].indexLevel[0]] })
                            }
                            firstValue.children = [...firstValue.children ?? [], ...lastValue.children ?? []]
                            firstValue.content = undefined;
                        } else {

                        }



                        console.log("updatedDataView", updatedDataView)

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
                        event.preventDefault()
                        await removedValue({ indexLevel, node, updatedDataView });
                        setEditorValue(updatedDataView)
                    }

                }

                else if (event.code === "Space") {

                }

            }}
            onPaste={(event) => {
                event.preventDefault();
            }}
        />

    )
}




