import { Editor } from '@/interface/editor';
import { generate, getCurrentlyEditedElement, updateNestedArray, } from '@/utils/editors';
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
                                    className: "font-bold italic bg-white text-black rounded-md px-2 py-[2px] mx-2",
                                    direction: "ltr",
                                    indent: 0,
                                    content: "To Link",
                                    format: null,
                                },
                                {
                                    id: v4(),
                                    type: "P",
                                    className: "",
                                    direction: "ltr",
                                    indent: 0,
                                    content: "Welcome ",
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
                            content: "Data",

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

    const contentEditableRef = useRef(null);
    return (
        <div
            className={`py-2 outline-none cursor-text block whitespace-pre-wrap break-words select-text `}
            ref={contentEditableRef}
            suppressContentEditableWarning={true}
            contentEditable

            onInput={async (event) => {
                const editedElement: any = getCurrentlyEditedElement()
                if (editedElement) {
                    let indexLevel = JSON.parse(editedElement.getAttribute("data-index-level"))


                    let id = editedElement.id;
                    let updatedDataView: Editor = JSON.parse(JSON.stringify(dataView));
                    updateNestedArray(updatedDataView.editorState.root, [...indexLevel], editedElement.textContent);

                    // const range = 
                    var selection = window.getSelection();
                    let currentPosition = selection!.focusOffset;
                    await setDataView(updatedDataView)



                    selection = window.getSelection();
                    // contentEditableElement!.appendChild(target);
                    // console.log("target", target, contentEditableElement);
                    if (selection !== null) {

                        var selection = window.getSelection();
                        const contentEditableElement = document.getElementById(id);
                        console.log("contentEditableElement", `editor-${id}`, contentEditableElement)

                        // contentEditableElement!.focus();
                        const range = selection!.getRangeAt(0);
                        range.setStart(contentEditableElement!.firstChild!, currentPosition)
                        // range.setEnd(range.endContainer, currentPosition);
                        range.collapse(true);
                        selection!.removeAllRanges();
                        console.log(range);
                        selection!.addRange(range);
                        contentEditableElement!.focus();


                        // contentEditableElement!.focus();
                        // // const range = selection!.getRangeAt(0);
                        // // const range = document.createRange();
                        // // range.setStart(contentEditableElement!, currentPosition);
                        // // range.setEnd(range.endContainer, currentPosition);
                        // range.collapse(false);
                        // selection.removeAllRanges();
                        // selection!.addRange(range);
                        // contentEditableElement!.focus();
                    }

                    // const cursorPosition = getCursorPosition(id);
                    // const contentEditableElement = document.getElementById(id);

                    // // const selection = window.getSelection();
                    // // const range = selection!.getRangeAt(0);

                    // // // 


                    // indexLevel = JSON.parse(editedElement.getAttribute("data-index-level"))
                    // // contentEditableElement!.innerText = 
                    // console.log(getNestedArray({ editorState: updatedDataView.editorState.root, indices: [...indexLevel] }));

                    // console.log("contentEditableElement", contentEditableElement, cursorPosition);
                    // if (selection!.rangeCount !== 0) {
                    //     console.log(range);
                    //     if (range) {
                    //         range.setEnd(range.endContainer, cursorPosition - 5);
                    //         range.collapse(false);
                    //         selection!.removeAllRanges();
                    //         selection!.addRange(range);
                    //         contentEditableElement!.focus();
                    //     }
                    // }
                }
            }}
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {

                // const editedElement: any = getCurrentlyEditedElement()

                // let indexLevel = JSON.parse(editedElement.getAttribute("data-index-level"))

                // if (event.key === "Enter") {
                //     event.preventDefault();

                //     let updatedDataView: Editor = JSON.parse(JSON.stringify(dataView));




                //     let data = updatedDataView.editorState.root[indexLevel[0]];

                //     data.id = v4();

                //     updatedDataView.editorState.root.splice(indexLevel[0], 0, data);

                //     setDataView(updatedDataView);



                // }
                // else if (event.key === "Tab") {
                //     event.preventDefault();
                // } else if (event.key === "Backspace") {
                //     if (editedElement.textContent.length === 0) {
                //         // event.preventDefault();
                //     }
                // }

            }}
            onPaste={(event) => {
                console.log(event);
            }}
            dangerouslySetInnerHTML={{
                __html: generate(dataView)
            }}
        />

    )
}
