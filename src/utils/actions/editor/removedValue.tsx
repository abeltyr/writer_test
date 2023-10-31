import { Editor } from '@/interface/editor';
import { getNestedArray } from '@/utils/editors';
import { nullifyValue } from '@/utils/actions/editor';

export const removedValue = (
    {
        indexLevel,
        node,
        updatedDataView,

    }: {
        indexLevel: number[],
        node: any,
        updatedDataView: Editor
    }) => {

    const newIndexLevel = [...indexLevel];

    let removedData = getNestedArray({
        editorState: updatedDataView.editorState.root,
        indexLevel: [...newIndexLevel],
    })

    if (removedData) {
        const nodeParent = node.parentElement;
        node.remove();
        if (nodeParent.children.length === 0) {
            newIndexLevel.pop();
            if (nodeParent)
                nodeParent.remove()
        }

        nullifyValue({
            indexLevel: newIndexLevel,
            updatedDataView,
        })
    }

}