import { EditorStateChildren } from '@/interface/editor'
import { getNestedArray, removeNestedArray } from '@/utils/editors'

export const cleanUpState = ({ editorState, indexLevel }: { editorState: EditorStateChildren[], indexLevel: number[] }) => {
    const value = getNestedArray({ editorState: editorState, indexLevel: [...indexLevel] })
    if (value) {
        console.log("!value.content && !value.children", !value.content && !value.children, value, indexLevel)
        if (value.children && value.children.length > 0) {
            value.children.map((_, index) => {
                cleanUpState({
                    editorState: value.children!,
                    indexLevel: [...indexLevel, index]
                })
            })
        }

        if (!value.content && !value.children) {
            removeNestedArray({ editorState: editorState, indexLevel: [...indexLevel] })
            console.log("editorState", editorState, indexLevel)
        }
    }
}

