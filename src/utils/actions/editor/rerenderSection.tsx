import { childIntegration } from '@/context/editor/childIntegration';
import { spanChild } from '@/context/editor/typography';
import { EditorStateChildren } from '@/interface/editor';
import { getNestedArray } from '@/utils/editors';


export const rerenderSection = ({ updatedDataView, indexLevel }: { updatedDataView: EditorStateChildren[], indexLevel: number[] }) => {
    const value = getNestedArray({ editorState: updatedDataView, indexLevel: [...indexLevel] })
    if (value) {
        const rerenderElement = document.getElementById(value.id);
        if (value.children && value.children.length > 0) {
            value?.children.map((editorStateData, index) => {
                const childElement = childIntegration({ editorStateData: editorStateData, indexLevel: [index] })
                if (rerenderElement?.children[index] == null) {
                    rerenderElement?.appendChild(childElement)
                } else {
                    rerenderElement?.replaceChild(childElement, rerenderElement.children[index])
                }
            });
        } else if (value.content != null) {
            const childElement = spanChild({
                editorStateData: value,
                indexLevel: [...indexLevel, 0],
            })
            if (rerenderElement?.children[0] == null) {
                rerenderElement?.appendChild(childElement)
            } else {
                rerenderElement?.replaceChild(childElement, rerenderElement.children[0])
            }
        }
    }
}
