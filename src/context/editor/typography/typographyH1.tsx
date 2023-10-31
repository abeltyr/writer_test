import { EditorStateChildren } from '@/interface/editor';
import { alignmentCheck, indentSetup } from '@/utils/editors';

export const h1Element = (
    {
        editorStateData,
        indexLevel,
    }: {
        editorStateData: EditorStateChildren,
        indexLevel: number[],
    }) => {

    const id = editorStateData.id;
    const element = document.createElement('h1');
    element.setAttribute('id', id);
    element.setAttribute('key', id);
    element.setAttribute('data-index-level', JSON.stringify(indexLevel));
    element.className = `font-extrabold tracking-tight text-4xl lg:text-5xl break-words cursor-text ${indentSetup(editorStateData.indent)} ${alignmentCheck(editorStateData.format)} ${editorStateData.className}`;
    return element
}