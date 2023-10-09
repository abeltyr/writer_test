'use client'

import { EditorStateChildren } from '@/interface/editor'
import React from 'react'

export const TypographySpan = ({
    editorState,
    indexLevel,
    skipValidation = false

}: {
    editorState: EditorStateChildren,
    indexLevel: number[]
    skipValidation?: boolean
}) => {
    if ((editorState.type === "P" && indexLevel.length > 1) || skipValidation)

        return (
            <span
                id={`editor-${editorState.id}`}
                key={editorState.id}
                data-index-level={JSON.stringify(indexLevel)}
                className={editorState.className}
                placeholder={""}
            >
                {editorState.content ? editorState.content : <br></br>}

            </span>
        )


}
