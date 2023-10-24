import { EditorStateChildren } from '@/interface/editor';

export const spanChild = ({ editorStateData, indexLevel }: { editorStateData: EditorStateChildren, indexLevel: number[], }) => {
    const element = document.createElement("span");
    element.setAttribute('id', `editor-${editorStateData.id}`);
    element.setAttribute('key', `editor-${editorStateData.id}`);
    element.setAttribute(
        'data-index-level',
        JSON.stringify(indexLevel)
    );
    if (editorStateData.className)
        element.className = editorStateData.className;
    if (editorStateData.content)
        element.textContent = editorStateData.content;
    else {
        const brChildElement = document.createElement("br");
        element.append(brChildElement);
    }
    return element
}