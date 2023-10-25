import { useEditor } from '@/context/editor/valueEditor';
import { Editor, EditorStateChildren } from '@/interface/editor';
import { check } from '@/utils/actions';
import { getCurrentlyEditedElement, getNestedArray, removeNestedArray, updateNestedArray, updateNestedArrayContent, } from '@/utils/editors';
import { updateCaretToMatch } from '@/utils/editors/editorData/cursor';
import React, { useEffect, useRef, } from 'react'

export const TextTest = () => {

    const { editorValue, setEditorValue, renderEditorDom } = useEditor();

    useEffect(() => {
        renderEditorDom();

    }, [])

    let indexLevel: number[];
    let currentPosition: number;
    let id: string;
    let removing = false;
    let inputKey = "";

    const contentEditableRef = useRef(null);
    return (
        <div
            id="editor"
            className={`py-2 px-4 outline-none cursor-text block whitespace-pre-wrap break-words select-text `}
            ref={contentEditableRef}
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
                    if (node.firstChild.nodeType === 3) {
                        const newIndexLevel = indexLevel;
                        currentPosition = selection!.focusOffset;
                        if (removing) {
                            let removedData = getNestedArray({
                                editorState: updatedDataView.editorState.root,
                                indexLevel: [...newIndexLevel],
                            })

                            if (removedData) {
                                if (newIndexLevel[newIndexLevel.length - 1] === 0) {
                                    console.log("Last one")
                                    newIndexLevel.pop();
                                    removedData = getNestedArray({
                                        editorState: updatedDataView.editorState.root,
                                        indexLevel: [...newIndexLevel],
                                    })

                                }
                                const data: EditorStateChildren = {
                                    id: removedData!.id,
                                    type: "P",
                                    className: "",
                                    direction: "",
                                    indent: removedData!.indent,
                                }
                                updateNestedArray({
                                    editorState: updatedDataView.editorState.root,
                                    indexLevel: [...newIndexLevel],
                                    value: data,
                                })
                            }

                        } else {
                            // update the value of the state based on the input
                            if (indexLevel != null) {
                                updateNestedArrayContent(
                                    {
                                        editorState: updatedDataView.editorState.root,
                                        indexLevel: [...indexLevel],
                                        value: node.textContent
                                    }
                                );
                            }
                        }
                    }
                    else {
                        if (updatedDataView.editorState.root[indexLevel[0]].children) {
                            check({ node, indexLevel, updatedDataView })
                            cartUpdate = false;
                        }

                    }

                    setEditorValue(updatedDataView)
                    if (cartUpdate) updateCaretToMatch(id, currentPosition, selection!);
                    console.log("updatedDataView", updatedDataView);

                }



            }}
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {

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

                // reset the removing variable
                removing = false;

                if (event.code === "Enter") {
                    event.preventDefault();
                }
                else if (event.code === "Tab") {
                    event.preventDefault();
                }
                else if (event.code === "Backspace") {

                    event.preventDefault();


                    let deletedText = ""
                    if (selection) {
                        const range = selection!.getRangeAt(0);
                        deletedText = range.toString();
                        console.log("deletedText", deletedText);
                    }

                    if (node.textContent.length === 1 || node.textContent === deletedText) {
                        removing = true;
                        event.preventDefault()
                        node?.remove()
                    }
                    console.log("childNode", node);
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
