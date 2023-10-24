import { EditorStateChildren } from '@/interface/editor';
import { alignmentCheck, indentSetup } from '@/utils/editors';

export const pElement = ({ editorStateData, indexLevel }: { editorStateData: EditorStateChildren, indexLevel: number[], }) => {
    const element = document.createElement('p');
    element.setAttribute('id', editorStateData.id);
    element.setAttribute('key', editorStateData.id);
    element.setAttribute('data-index-level', JSON.stringify(indexLevel));
    element.className = `leading-7 outline-none cursor-text ${indentSetup(editorStateData.indent)} ${alignmentCheck(editorStateData.format)} ${editorStateData.className}`;
    return element
}