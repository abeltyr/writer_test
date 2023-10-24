import { useEditor } from '@/context/editor/valueEditor';
import { Editor } from '@/interface/editor';
import { nextCreate, nextUpdate } from '@/utils/actions';
import { check } from '@/utils/actions';
import { getCurrentlyEditedElement, getNestedArray, updateNestedArrayContent, } from '@/utils/editors';
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
                            //     let nextIndex = [...indexLevel];
                            //     removeNestedArray(updatedDataView.editorState.root,
                            //         [...indexLevel],
                            //     )
                            //     if (nextIndex[nextIndex.length - 1] - 1 >= 0) {
                            //         console.log(indexLevel, nextIndex)
                            //         nextIndex[nextIndex.length - 1] = nextIndex[indexLevel.length - 1] - 1;
                            //         const data = getNestedArray({ editorState: updatedDataView.editorState.root, indices: [...nextIndex] },)
                            //         console.log(data, nextIndex);
                            //         if (data) {
                            //             console.log("currentPosition", data.children, data.children!.length >= 1);
                            //             if (data.content) {
                            //                 currentPosition = data!.content!.length!
                            //                 id = data!.id
                            //             }
                            //             if (data.children && data.children.length >= 1) {
                            //                 currentPosition = data!.children![data!.children.length - 1]!.content!.length!
                            //                 console.log(data!.children![data!.children.length - 1]!.content!.length!);
                            //                 id = data!.children![data!.children.length - 1]!.id
                            //             }
                            //         }
                            //     }
                        } else {
                            // update the value of the state based on the input

                            console.log(node.textContent, indexLevel);
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
                            // const fetchNextChild = getNestedArray({ editorState: updatedDataView.editorState.root, indexLevel: [...nextIndexLevel] })

                            check({ node, nextIndexLevel, updatedDataView });
                            // if (fetchNextChild) {
                            //     const { updatedCurrentPosition, updatedId } = nextUpdate(
                            //         {
                            //             fetchNextChild,
                            //             inputKey,
                            //             nextIndexLevel,
                            //             node,
                            //             updatedDataView,
                            //         }
                            //     )
                            //     id = updatedId;
                            //     currentPosition = updatedCurrentPosition;
                            // } else {
                            //     const { createCurrentPosition, createId } = nextCreate(
                            //         {
                            //             inputKey,
                            //             indexLevel,
                            //             nextIndexLevel,
                            //             node,
                            //             updatedDataView,
                            //         }
                            //     )
                            //     id = createId;
                            //     currentPosition = createCurrentPosition;
                            // }
                            // appendNestedArray(
                            //     updatedDataView.editorState.root,
                            //     [...index],
                            //     {
                            //         id: id,
                            //         className: "",
                            //         direction: "",
                            //         indent: 0,
                            //         type: "P",
                            //         content: " test"
                            //     }
                            // );
                        }

                    }

                    console.log("updatedDataView", updatedDataView);
                    await setEditorValue(updatedDataView)
                    // await updateCaretToMatch(id, currentPosition, selection!);

                    // console.log(updatedDataView);
                    // const lastChild = node.lastChild;

                    // console.log("lastChild", lastChild);
                    // // Check if the last child is a text node
                    // if (lastChild && lastChild.nodeType === 3) {
                    //     const span = document.createElement('span');
                    //     span.textContent = lastChild.textContent;

                    //     // Replace the text node with the new span
                    //     node.replaceChild(span, lastChild);
                    // }
                }



            }}
            onKeyUp={() => {
            }}
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {

                inputKey = event.key;
                removing = false;
                const { selection, node } = getCurrentlyEditedElement()


                indexLevel = JSON.parse(node.getAttribute("data-index-level"))

                // get the current Position of the caret to adjust latter
                currentPosition = selection!.focusOffset;
                id = node.id;
                // let indexLevel = JSON.parse(editedElement.getAttribute("data-index-level"))

                if (event.code === "Enter") {
                    event.preventDefault();
                }
                else if (event.code === "Space") {
                    // get the index level of the span that is currently being edited from the root 


                    // event.preventDefault();
                }
                else if (event.code === "Tab") {
                    event.preventDefault();
                }
                else if (event.code === "Backspace") {
                    console.log("remove", node.textContent, node.textContent.length === 1)
                    if (node.textContent.length === 1) {
                        removing = true;
                    }
                    // event.preventDefault();
                }

                //     let updatedDataView: Editor = JSON.parse(JSON.stringify(dataView));
                //     let data = updatedDataView.editorState.root[indexLevel[0]];
                //     data.id = v4();
                //     updatedDataView.editorState.root.splice(indexLevel[0], 0, data);
                //     setDataView(updatedDataView);
                // }
                // else if (event.key === "Tab") {
                //     event.preventDefault();
                // } else 
                // if (event.key === "Backspace") {
                //     event.preventDefault();
                //     if (node.textContent.length === 1) {
                //     }
                // }

            }}
            onPaste={(event) => {
                // console.log(event);
                event.preventDefault();
            }}
        />

    )
}
