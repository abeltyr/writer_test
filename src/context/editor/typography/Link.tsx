import { EditorStateChildren } from '@/interface/editor';

export const linkElement = ({ editorStateData, indexLevel }: { editorStateData: EditorStateChildren, indexLevel: number[] }) => {
    const element = document.createElement("a");
    element.setAttribute('id', editorStateData.id);
    element.setAttribute('key', editorStateData.id);
    element.setAttribute(
        'data-index-level',
        JSON.stringify(indexLevel)
    );
    element.className = `underline text-blue-300 italic ${editorStateData.className}`;
    if (editorStateData.additional?.link) {
        element.setAttribute('href', editorStateData.additional?.link?.href);
        element.setAttribute('target', editorStateData.additional?.link?.target ?? "_blank");
    }
    return element
}