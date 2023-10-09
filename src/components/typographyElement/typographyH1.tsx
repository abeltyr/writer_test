'use client'

import { EditorStateChildren } from '@/interface/editor'
import { DefaultRun, alignmentCheck, indentSetup } from '@/utils/editors'
import React from 'react'

export const TypographyH1 = ({
    editorState,
    indexLevel
}: {
    editorState: EditorStateChildren,
    indexLevel: number[]
}) => {

    if (editorState.type === "H1")
        return (
            <h1
                key={editorState.id}
                id={editorState.id}
                className={`font-extrabold tracking-tight text-4xl lg:text-5xl break-words cursor-text ${indentSetup(editorState.indent)} ${alignmentCheck(editorState.format)} ${editorState.className}`}
                data-index-level={JSON.stringify(indexLevel)}
                placeholder={"Header 1"}
            >
                <DefaultRun editorState={editorState} indexLevel={indexLevel} />
            </h1>
        )

}
