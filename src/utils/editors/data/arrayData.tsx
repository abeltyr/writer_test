import { EditorStateChildren } from '@/interface/editor';

export const updateNestedArrayContent = (editorState: EditorStateChildren[], indices: number[], value: any): void => {
    if (indices) {
        // Get the first index
        let indexData: number = indices.shift()!;

        // If there are more indices, recurse deeper
        if (indices.length > 0 && editorState[indexData].children != null) {
            updateNestedArrayContent(editorState[indexData].children!, [...indices], value);
        } else if (editorState[indexData].content) {
            // If this is the last index, update the value
            editorState[indexData].content = value;
        }
    }
}

export const removeNestedArray = (editorState: EditorStateChildren[], indices: number[]): void => {
    if (indices) {
        // Get the first index
        let indexData: number = indices.shift()!;
        // If there are more indices, recurse deeper
        if (indices.length > 0 && editorState[indexData].children != null) {
            removeNestedArray(editorState[indexData].children!, [...indices]);
        } else if (editorState[indexData].content) {
            editorState.splice(indexData, 1);
        }
    }
}


export const appendNestedArray = (editorState: EditorStateChildren[], indices: number[], value: EditorStateChildren): void => {
    if (indices) {
        // Get the first index
        let indexData: number = indices.shift()!;

        // If there are more indices, recurse deeper
        if (indices.length > 0 && editorState[indexData].children != null) {
            appendNestedArray(editorState[indexData].children!, [...indices], value);
        } else if (editorState[indexData].content) {
            // If this is the last index, update the value
            editorState[indexData].children = [...editorState[indexData].children!, value];
        }
    }
}


export const getNestedArray = ({ editorState, indices }: { editorState: EditorStateChildren[], indices: number[] }): EditorStateChildren | null => {
    let value: EditorStateChildren | null = null;

    if (indices) {
        // Get the first index
        let indexData: number = indices.shift()!;

        // If there are more indices, recurse deeper
        if (indices.length > 0 && editorState[indexData] && editorState[indexData].children != null) {
            value = getNestedArray({ editorState: editorState[indexData].children!, indices: [...indices] });
        } else if (editorState[indexData]) {
            value = editorState[indexData];
        }
    }
    return value;
}