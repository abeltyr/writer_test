
import { EditorStateChildren } from '@/interface/editor';
import { h1Element, linkElement, pElement, spanChild } from './typography';

export const childIntegration = (
    {
        editorStateData,
        indexLevel,
    }: {
        editorStateData: EditorStateChildren,
        indexLevel: number[],
    }
) => {
    let parentElement: HTMLElement;
    let childElement: HTMLElement;


    if (editorStateData.type === "InlineLink") {
        parentElement = linkElement({ editorStateData, indexLevel: indexLevel })
    }
    else if (editorStateData.type === "H1") {
        parentElement = h1Element({ editorStateData, indexLevel: indexLevel })
    }
    else {
        if (indexLevel.length > 1)
            parentElement = spanChild({ editorStateData, indexLevel: indexLevel })
        else
            parentElement = pElement({ editorStateData, indexLevel: indexLevel })
    }

    if (editorStateData.children) {
        editorStateData.children.map((value, index) => {
            childElement = childIntegration({
                editorStateData: value,
                indexLevel: [...indexLevel, index]
            })
            parentElement.appendChild(childElement);
        })
    }

    if (editorStateData.content != null) {
        let hasChild = false;
        if (editorStateData.type != "P" || (editorStateData.type == "P" && indexLevel.length === 1)) {
            hasChild = true;
        }
        if (hasChild) {
            childElement = spanChild({
                editorStateData: editorStateData,
                indexLevel: [...indexLevel, 0],
            })
            parentElement.appendChild(childElement);
        }
    }

    return parentElement;
}
