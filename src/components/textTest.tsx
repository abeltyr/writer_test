import { Editor } from '@/interface/editor';
import { generate, getCurrentlyEditedElement, appendNestedArray, updateNestedArrayContent, getNestedArray, removeNestedArray, } from '@/utils/editors';
import { updateCaretToMatch } from '@/utils/editors/editorData/cursor';
import React, { useRef, useState } from 'react'
import { v4 } from "uuid"

export const TextTest = () => {

    const [dataView, setDataView] = useState<Editor>({
        id: "",
        editorState: {
            root: [
                {
                    id: v4(),
                    type: "H1",
                    className: "",
                    direction: "ltr",
                    indent: 0,
                    content: "",
                    format: null,
                },
                {
                    id: v4(),
                    type: "P",
                    className: "",
                    direction: "ltr",
                    indent: 10,
                    children: [
                        {
                            id: v4(),
                            type: "P",
                            className: "",
                            direction: "ltr",
                            indent: 0,
                            content: "Welcome ",
                            format: null,

                        },
                        {
                            id: v4(),
                            type: "InlineLink",
                            className: "",
                            direction: "ltr",
                            indent: 0,
                            // content: "To Link ",
                            children: [
                                {
                                    id: v4(),
                                    type: "P",
                                    className: "font-bold italic",
                                    direction: "ltr",
                                    indent: 0,
                                    content: "To ",
                                    format: null,
                                },
                                {
                                    id: v4(),
                                    type: "P",
                                    className: "",
                                    direction: "ltr",
                                    indent: 0,
                                    content: "Link",
                                    format: null,
                                },
                            ],
                            additional: {
                                link: {
                                    href: "https://google.com",
                                }
                            },

                        },
                        {
                            id: v4(),
                            type: "P",
                            className: "",
                            direction: "ltr",
                            indent: 0,
                            content: "P:p Data",

                        },
                        {
                            id: v4(),
                            type: "InlineLink",
                            className: "",
                            direction: "ltr",
                            indent: 0,
                            // content: "To Link ",
                            children: [
                                {
                                    id: v4(),
                                    type: "P",
                                    className: "font-bold italic",
                                    direction: "ltr",
                                    indent: 0,
                                    content: "To ",
                                    format: null,
                                },
                                {
                                    id: v4(),
                                    type: "P",
                                    className: "",
                                    direction: "ltr",
                                    indent: 0,
                                    content: "Link",
                                    format: null,
                                },
                            ],
                            additional: {
                                link: {
                                    href: "https://google.com",
                                }
                            },

                        },
                    ],
                    format: "Start"
                }
            ],
            rule: {
                availableFeature: [],
                maxChildrenAmount: null

            }
        },
        editorVersion: "0.0.1",
        lastSaved: new Date().toISOString(),
        source: "Playground",
        version: "1"

    })

    let indexLevel: number[];
    let currentPosition: number;
    let id: string;
    let removing = false;

    const contentEditableRef = useRef(null);
    return (
        <div
            className={`py-2 px-4 outline-none cursor-text block whitespace-pre-wrap break-words select-text `}
            ref={contentEditableRef}
            suppressContentEditableWarning={true}
            contentEditable

            onInput={async (event) => {
                let { selection, node } = getCurrentlyEditedElement()
                if (node && selection) {

                    // console.log("node", node);
                    // console.log("firstChild",);
                    // console.log("lastChild", node.lastChild, node.lastChild.nodeType === 3);


                    // unlink the current data set 
                    let updatedDataView: Editor = JSON.parse(JSON.stringify(dataView));

                    if (node.firstChild.nodeType === 3) {
                        currentPosition = selection!.focusOffset;
                        if (removing) {

                            let nextIndex = [...indexLevel];
                            console.log(indexLevel, nextIndex)
                            removeNestedArray(updatedDataView.editorState.root,
                                [...indexLevel],
                            )


                            if (nextIndex[nextIndex.length - 1] - 1 >= 0) {
                                console.log(indexLevel, nextIndex)
                                nextIndex[nextIndex.length - 1] = nextIndex[indexLevel.length - 1] - 1;
                                const data = getNestedArray({ editorState: updatedDataView.editorState.root, indices: [...nextIndex] },)
                                console.log(data, nextIndex);
                                if (data) {

                                    console.log("currentPosition", data.children, data.children!.length >= 1);
                                    if (data.content) {
                                        currentPosition = data!.content!.length!
                                        id = data!.id
                                    }

                                    if (data.children && data.children.length >= 1) {
                                        currentPosition = data!.children![data!.children.length - 1]!.content!.length!
                                        console.log(data!.children![data!.children.length - 1]!.content!.length!);
                                        id = data!.children![data!.children.length - 1]!.id
                                    }

                                }

                            }

                            else {

                            }
                        } else {
                            updateNestedArrayContent(
                                updatedDataView.editorState.root,
                                [...indexLevel],
                                node.textContent
                            );
                            console.log("updatedDataView nodeType 3", updatedDataView)
                        }
                    }
                    else {
                        if (updatedDataView.editorState.root[indexLevel[0]].children) {

                            console.log("next check", updatedDataView.editorState.root[indexLevel[0]].children![indexLevel[1] + 1])
                            if (updatedDataView.editorState.root[indexLevel[0]].children![indexLevel[1] + 1]) {
                                id = updatedDataView.editorState.root[indexLevel[0]].children![indexLevel[1] + 1]!.id!;

                                if (updatedDataView.editorState.root[indexLevel[0]].children![indexLevel[1] + 1]!.content) {
                                    updatedDataView.editorState.root[indexLevel[0]].children![indexLevel[1] + 1]!.content = " " + updatedDataView.editorState.root[indexLevel[0]].children![indexLevel[1] + 1]!.content;
                                }
                                if (updatedDataView.editorState.root[indexLevel[0]].children![indexLevel[1] + 1]!.children && updatedDataView.editorState.root[indexLevel[0]].children![indexLevel[1] + 1]!.children!.length > 1) {
                                    updatedDataView.editorState.root[indexLevel[0]].children![indexLevel[1] + 1]!.children![0].content = " " + updatedDataView.editorState.root[indexLevel[0]].children![indexLevel[1] + 1]!.children![0].content;
                                }
                                currentPosition = 1;
                            } else {

                                id = v4();
                                currentPosition = 1;
                                updatedDataView.editorState.root[indexLevel[0]].children! = [
                                    ...updatedDataView.editorState.root[indexLevel[0]].children!,
                                    {
                                        id: id,
                                        type: "P",
                                        className: "",
                                        direction: "",
                                        indent: 0,
                                        content: " "
                                    }
                                ];

                                console.log("updatedDataView nodeType 1", indexLevel[0], updatedDataView)
                            }

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

                    await setDataView(updatedDataView)
                    await updateCaretToMatch(id, currentPosition, selection!);

                    // console.log(updatedDataView);
                    //     const lastChild = node.lastChild;

                    //     console.log("lastChild", lastChild);
                    //     // Check if the last child is a text node
                    //     if (lastChild && lastChild.nodeType === 3) {
                    //         const span = document.createElement('span');
                    //         span.textContent = lastChild.textContent;

                    //         // Replace the text node with the new span
                    //         node.replaceChild(span, lastChild);
                    //     }
                }
            }}
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
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
            dangerouslySetInnerHTML={{
                __html: generate(dataView)
            }}
        />

    )
}
