import { Editor, EditorStateChildren } from '@/interface/editor'
import { getNestedArray, updateNestedArray } from '@/utils/editors'

export const nullifyValue = (
    {
        indexLevel,
        updatedDataView,
    }: {
        indexLevel: number[],
        updatedDataView: Editor
    }) => {


    let removedData = getNestedArray({
        editorState: updatedDataView.editorState.root,
        indexLevel: [...indexLevel],
    })

    if (removedData) {
        const data: EditorStateChildren = {
            id: removedData!.id,
            type: "P",
            className: "",
            direction: "",
            indent: removedData!.indent,
        }
        updateNestedArray(
            {
                editorState: updatedDataView.editorState.root,
                indexLevel: [...indexLevel],
                value: data,
            }
        )
    }

}
