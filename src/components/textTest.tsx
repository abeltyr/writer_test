import { useEditor } from '@/context/editor/valueEditor';
import { Editor } from '@/interface/editor';
import { nextCreate, nextUpdate } from '@/utils/actions';
import { check } from '@/utils/actions';
import { getCurrentlyEditedElement, getNestedArray, removeNestedArray, updateNestedArrayContent, } from '@/utils/editors';
import { updateCaretToMatch } from '@/utils/editors/editorData/cursor';
import React, { useEffect, useRef, } from 'react'

export const TextTest = () => {

    const { editorValue, setEditorValue, editorDomValue, setEditorDomValue, renderEditorDom } = useEditor();

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

                    if (node.firstChild.nodeType === 3) {
                        currentPosition = selection!.focusOffset;
                        if (removing) {
                            console.log("removing", indexLevel)
                            const newIndex = [...indexLevel];


                            const removedData = newIndex.pop() ?? 0;

                            const parentData = getNestedArray({ editorState: updatedDataView.editorState.root, indexLevel: [...newIndex] })

                            console.log("parentData", parentData, (parentData?.children?.length ?? 0) - 1, removedData)
                            console.log("indexLevel", indexLevel)
                            console.log("newIndex", newIndex)
                            console.log("removedData", removedData)

                            if ((parentData?.children?.length ?? 0) - 1 > removedData) {

                                console.log("need to update the next ones")

                            }

                            // removeNestedArray(updatedDataView.editorState.root,
                            //     [...indexLevel],
                            // )
                            // adjust the index level for the subsequent values

                            // if (nextIndex[nextIndex.length - 1] - 1 >= 0) {
                            //     console.log(indexLevel, nextIndex)
                            //     nextIndex[nextIndex.length - 1] = nextIndex[indexLevel.length - 1] - 1;
                            //     const data = getNestedArray({ editorState: updatedDataView.editorState.root, indices: [...nextIndex] },)
                            //     console.log(data, nextIndex);
                            //     if (data) {
                            //         console.log("currentPosition", data.children, data.children!.length >= 1);
                            //         if (data.content) {
                            //             currentPosition = data!.content!.length!
                            //             id = data!.id
                            //         }
                            //         if (data.children && data.children.length >= 1) {
                            //             currentPosition = data!.children![data!.children.length - 1]!.content!.length!
                            //             console.log(data!.children![data!.children.length - 1]!.content!.length!);
                            //             id = data!.children![data!.children.length - 1]!.id
                            //         }
                            //     }
                            // }
                        } else {
                            // update the value of the state based on the input
                            updateNestedArrayContent(
                                {
                                    editorState: updatedDataView.editorState.root,
                                    indexLevel: [...indexLevel],
                                    value: node.textContent
                                }
                            );
                        }
                    }
                    else {
                        if (updatedDataView.editorState.root[indexLevel[0]].children) {
                            let nextIndexLevel = [...indexLevel];
                            nextIndexLevel.pop();
                            nextIndexLevel[nextIndexLevel.length - 1] = nextIndexLevel[nextIndexLevel.length - 1] + 1;
                            check({ node, nextIndexLevel, updatedDataView })
                        }

                    }

                    setEditorValue(updatedDataView)
                    updateCaretToMatch(id, currentPosition, selection!);
                    // console.log("updatedDataView", updatedDataView);
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

                else if (event.code === "Space") {
                }
                else if (event.code === "Tab") {
                    event.preventDefault();
                }

                else if (event.code === "Backspace") {
                    const childNode = document.getElementById(id);
                    if (node.textContent.length === 1) {
                        removing = true;
                    }
                }

            }}
            onPaste={(event) => {
                event.preventDefault();
            }}
        />

    )
}
