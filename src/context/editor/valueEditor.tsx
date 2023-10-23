'use client'

import { Editor, EditorStateChildren } from '@/interface/editor';
import { alignmentCheck, indentSetup } from '@/utils/editors';
import React, { useContext, useState } from "react";
import { v4 } from "uuid";

const defaultEditorValue: Editor = {
    id: v4(),
    editorState: {
        root: [
            {
                id: v4(),
                type: "H1",
                className: "",
                direction: "ltr",
                indent: 0,
                content: "Polland",
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
        },
    },
    editorVersion: "0.0.1",
    lastSaved: new Date().toDateString(),
    source: "Editor",
    version: "1"
};

const initialValues: {
    editorValue: Editor,
    setEditorValue: Function,
    renderEditorDom: Function,
} = {
    editorValue: defaultEditorValue,
    setEditorValue: () => { },
    renderEditorDom: () => { }
};

type Props = {
    children?: React.ReactNode;
};

const EditorContext = React.createContext(initialValues);

const useEditor = () => useContext(EditorContext);

const EditorProvider: React.FC<Props> = ({ children }) => {

    const [editorDomValue, setEditorDomValue] = useState<any>()
    const [editorValue, setEditorValue] = useState<Editor>(defaultEditorValue)




    const renderEditorDom = () => {

        let updatedEditorDomValue = { ...editorDomValue };

        const rootEditorElement = document.getElementById('editor');

        editorValue.editorState.root.map((editorStateData, index) => {
            if (editorStateData.type === "P") {
                const parentElement = addPElement({ editorStateData, indexLevel: [index] })

                let childElement = addSpanChild({
                    editorStateData: editorStateData.children![0],
                    indexLevel: [index, 0],
                })

                parentElement.appendChild(childElement);
                if (rootEditorElement?.children[index] == null) {
                    rootEditorElement?.appendChild(parentElement)
                } else {
                    rootEditorElement?.replaceChild(parentElement, rootEditorElement.children[index])
                }

                updatedEditorDomValue[editorStateData.id] = parentElement;
                setEditorDomValue(updatedEditorDomValue);

                childElement = addSpanChild({
                    editorStateData: editorStateData.children![2],
                    indexLevel: [index, 1],
                })

                parentElement.appendChild(childElement);
                if (rootEditorElement?.children[index] == null) {
                    rootEditorElement?.appendChild(parentElement)
                } else {
                    rootEditorElement?.replaceChild(parentElement, rootEditorElement.children[index])
                }

                updatedEditorDomValue[editorStateData.id] = parentElement;
                setEditorDomValue(updatedEditorDomValue);
            }

            if (editorStateData.type === "H1") {
                const parentElement = addH1Element({ editorStateData, indexLevel: [index] })

                let childElement = addSpanChild({
                    editorStateData: editorStateData,
                    indexLevel: [index, 0],
                })

                parentElement.appendChild(childElement);
                if (rootEditorElement?.children[index] == null) {
                    rootEditorElement?.appendChild(parentElement)
                } else {
                    rootEditorElement?.replaceChild(parentElement, rootEditorElement.children[index])
                }

                updatedEditorDomValue[editorStateData.id] = parentElement;


            }

            if (editorStateData.type === "InlineLink") {
                const parentElement = addLinkElement({ editorStateData, indexLevel: [index] })

                const childElement = addSpanChild({
                    editorStateData: editorStateData,
                    indexLevel: [index, 0],
                })

                parentElement.appendChild(childElement);
                if (rootEditorElement?.children[index] == null) {
                    rootEditorElement?.appendChild(parentElement)
                } else {
                    rootEditorElement?.replaceChild(parentElement, rootEditorElement.children[index])
                }

                updatedEditorDomValue[editorStateData.id] = parentElement;
                setEditorDomValue(updatedEditorDomValue);
            }

        });
        console.log(updatedEditorDomValue);
    }



    const addSpanChild = ({ editorStateData, indexLevel }: { editorStateData: EditorStateChildren, indexLevel: number[], }) => {
        const childElement = document.createElement("span");
        childElement.setAttribute('id', `editor-${editorStateData.id}`);
        childElement.setAttribute('key', `editor-${editorStateData.id}`);
        childElement.setAttribute(
            'data-index-level',
            JSON.stringify(indexLevel)
        );
        if (editorStateData.content) {

            childElement.textContent = editorStateData.content;
        } else {
            const brChildElement = document.createElement("br");
            childElement.append(brChildElement);
        }

        return childElement
    }

    const addLinkElement = ({ editorStateData, indexLevel }: { editorStateData: EditorStateChildren, indexLevel: number[] }) => {
        const element = document.createElement("a");
        element.setAttribute('id', editorStateData.id);
        element.setAttribute('key', editorStateData.id);
        element.setAttribute(
            'data-index-level',
            JSON.stringify(indexLevel)
        );
        if (editorStateData.additional?.link) {
            element.setAttribute('href', editorStateData.additional?.link?.href);
            element.setAttribute('target', editorStateData.additional?.link?.target ?? "_blank");
            element.className = `${editorStateData.className} underline text-blue-300 italic`;
        }
        return element
    }

    const addPElement = ({ editorStateData, indexLevel }: { editorStateData: EditorStateChildren, indexLevel: number[], }) => {
        const element = document.createElement('p');
        element.setAttribute('id', editorStateData.id);
        element.setAttribute('key', editorStateData.id);
        element.setAttribute('data-index-level', JSON.stringify([indexLevel]));
        element.className = `leading-7 outline-none cursor-text ${indentSetup(editorStateData.indent)} ${alignmentCheck(editorStateData.format)} ${editorStateData.className}`;
        return element
    }

    const addH1Element = ({ editorStateData, indexLevel }: { editorStateData: EditorStateChildren, indexLevel: number[], }) => {
        const element = document.createElement('h1');
        element.setAttribute('id', editorStateData.id);
        element.setAttribute('key', editorStateData.id);
        element.setAttribute('data-index-level', JSON.stringify([indexLevel]));
        element.className = `font-extrabold tracking-tight text-4xl lg:text-5xl break-words cursor-text ${indentSetup(editorStateData.indent)} ${alignmentCheck(editorStateData.format)} ${editorStateData.className}`;
        return element
    }


    return (
        <EditorContext.Provider
            value={{
                editorValue,
                setEditorValue,
                renderEditorDom
            }}
        >
            {children}
        </EditorContext.Provider>
    );
};

export { EditorProvider, useEditor };