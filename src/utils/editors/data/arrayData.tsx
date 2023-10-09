import { EditorStateChildren } from '@/interface/editor';

export const updateNestedArray = (editorState: EditorStateChildren[], indices: number[], value: any): void => {
    if (indices) {
        // Get the first index
        let indexData: number = indices.shift()!;

        // If there are more indices, recurse deeper
        if (indices.length > 0 && editorState[indexData].children != null) {
            updateNestedArray(editorState[indexData].children!, [...indices], value);
        } else if (editorState[indexData].content) {
            // If this is the last index, update the value
            editorState[indexData].content = value;
        }
    }
}


export const getNestedArray = ({ editorState, indices }: { editorState: EditorStateChildren[], indices: number[] }): string | undefined => {
    let value: string | undefined = "test data";

    if (indices) {
        // Get the first index
        let indexData: number = indices.shift()!;

        // If there are more indices, recurse deeper
        if (indices.length > 0 && editorState[indexData] && editorState[indexData].children != null) {
            value = getNestedArray({ editorState: editorState[indexData].children!, indices: [...indices] });
        } else if (editorState[indexData] && editorState[indexData]!.content) {
            value = editorState[indexData].content;
        }
    }
    return value;
}