import { EditorStateChildren } from '@/interface/editor';

export const updateNestedArray = ({ editorState, indexLevel, value }: { editorState: EditorStateChildren[], indexLevel: number[], value: EditorStateChildren }): void => {
    if (indexLevel) {
        // Get the first index
        let indexData: number = indexLevel.shift()!;

        // If there are more indexLevel, recurse deeper
        if (indexLevel.length > 0 && editorState[indexData].children != null) {
            updateNestedArray({ editorState: editorState[indexData].children!, indexLevel: [...indexLevel], value });
        } else {
            // If this is the last index, update the value
            editorState[indexData] = value;
        }
    }
}

export const updateNestedArrayContent = ({ editorState, indexLevel, value }: { editorState: EditorStateChildren[], indexLevel: number[], value: any }): void => {
    if (indexLevel) {
        // Get the first index
        let indexData: number = indexLevel.shift()!;

        // If there are more indexLevel, recurse deeper
        if (indexLevel.length > 0 && editorState[indexData].children != null) {
            updateNestedArrayContent({ editorState: editorState[indexData].children!, indexLevel: [...indexLevel], value });
        } else if (editorState[indexData].content) {
            // If this is the last index, update the value
            editorState[indexData].content = value;
        }
    }
}

export const removeNestedArray = ({ editorState, indexLevel }: { editorState: EditorStateChildren[], indexLevel: number[] }): void => {
    if (indexLevel) {
        // Get the first index
        let indexData: number = indexLevel.shift()!;
        // If there are more indexLevel, recurse deeper
        if (indexLevel.length > 0 && editorState[indexData].children != null) {
            removeNestedArray({ editorState: editorState[indexData].children!, indexLevel: [...indexLevel] });
        } else {
            editorState.splice(indexData, 1);
        }
    }
}


export const appendNestedArray = ({ value, editorState, indexLevel }: { editorState: EditorStateChildren[], indexLevel: number[], value: EditorStateChildren }): void => {
    if (indexLevel) {
        // Get the first index
        let indexData: number = indexLevel.shift()!;

        // If there are more indexLevel, recurse deeper
        if (indexLevel.length > 1 && editorState[indexData].children != null) {
            appendNestedArray({ editorState: editorState[indexData].children!, indexLevel: [...indexLevel], value });
        } else {
            // If this is the last index, insert the value
            let valueData: EditorStateChildren[] = [];
            console.log(editorState[indexData]);
            if (editorState[indexData].children) {
                valueData = [...editorState[indexData].children!];
            }
            editorState[indexData].children = [...valueData, value];
            console.log("editorState", editorState)
        }
    }
}


export const getNestedArray = ({ editorState, indexLevel }: { editorState: EditorStateChildren[], indexLevel: number[] }): EditorStateChildren | null => {
    let value: EditorStateChildren | null = null;

    if (indexLevel) {
        // Get the first index
        let indexData: number = indexLevel.shift()!;

        // If there are more indexLevel, recurse deeper
        if (indexLevel.length > 0 && editorState[indexData] && editorState[indexData].children != null) {
            value = getNestedArray({ editorState: editorState[indexData].children!, indexLevel: [...indexLevel] });
        } else if (editorState[indexData]) {
            value = editorState[indexData];
        }
    }
    return value;
}