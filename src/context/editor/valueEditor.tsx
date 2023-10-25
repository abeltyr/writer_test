'use client'

import { Editor, EditorStateChildren } from '@/interface/editor';
import React, { useContext, useState } from "react";
import { v4 } from "uuid";
import { childIntegration } from './childIntegration';

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
                        className: "no-underline font-bold",
                        direction: "ltr",
                        indent: 0,
                        children: [
                            {
                                id: v4(),
                                type: "P",
                                className: "font-bold text-red-300 italic",
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
                        content: " Pp Data ",

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

    const [editorValue, setEditorValue] = useState<Editor>(defaultEditorValue)

    const renderEditorDom = () => {
        const rootEditorElement = document.getElementById('editor');
        editorValue.editorState.root.map((editorStateData, index) => {
            const parentElement = childIntegration({ editorStateData: editorStateData, indexLevel: [index] })
            if (rootEditorElement?.children[index] == null) {
                rootEditorElement?.appendChild(parentElement)
            } else {
                rootEditorElement?.replaceChild(parentElement, rootEditorElement.children[index])
            }
        });
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