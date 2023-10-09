'use client'

import { EditorStateChildren } from '@/interface/editor'
import { DefaultRun } from '@/utils/editors'
import React from 'react'

export const TypographyA = ({
    editorState,
    indexLevel
}: {
    editorState: EditorStateChildren,
    indexLevel: number[]
}) => {
    if (
        editorState.type === "InlineLink"
        && editorState.additional?.link != null
        && editorState.additional?.link?.href != null
    )
        return (
            <a
                href={editorState.additional?.link?.href}
                target={editorState.additional?.link?.target!}
                key={editorState.id}
                id={editorState.id}
                className={editorState.className}
                data-index-level={JSON.stringify(indexLevel)}
            >
                <DefaultRun editorState={editorState} indexLevel={indexLevel} />
            </a>
        )
}
