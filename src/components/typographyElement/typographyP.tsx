'use client'

import { EditorStateChildren } from '@/interface/editor'
import { DefaultRun, alignmentCheck, indentSetup } from '@/utils/editors'
import React from 'react'

export const TypographyP = ({
    editorState,
    indexLevel
}: {
    editorState: EditorStateChildren,
    indexLevel: number[]
}) => {

    if (editorState.type === "P" && indexLevel.length == 1)
        return (
            <p
                id={editorState.id}
                key={editorState.id}
                data-index-level={JSON.stringify(indexLevel)}
                className={`leading-7 outline-none cursor-text ${indentSetup(editorState.indent)} ${alignmentCheck(editorState.format)} ${editorState.className}`}
            >
                <DefaultRun editorState={editorState} indexLevel={indexLevel} />
            </p>
        )
}
