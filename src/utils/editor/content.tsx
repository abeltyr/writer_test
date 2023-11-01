import { EditorContentType, EditorStateContentType } from '@/interface/editor';


let contents: EditorContentType = {}


export const updateContents = (value: EditorContentType) => {
    contents = value;
}

export const upsetContent = ({ id, value }: { id: string, value: EditorStateContentType }) => {
    contents[id] = value;
}

export const updateValueContent = async ({ id, value }: { id: string, value: string }) => {
    let update = false;
    if (contents[id]) {
        contents[id].content = value;
        contents[id].children = undefined;
        update = true;
    }
    return update
}

export const removeContent = ({ id }: { id: string, }) => {
    delete contents[id];
}


export const getContent = ({ id }: { id: string, }) => {
    return contents[id];
}

export const getContents = () => {
    return { ...contents };
}


export const getRootParentIndex = ({ contentValue }: { contentValue: EditorStateContentType }) => {
    let id = "";

    if (contentValue && contentValue.parentId) {
        id = getRootParentIndex({ contentValue: contents[contentValue.parentId] })
    } else {
        id = contentValue.id;
    }
    return id;
}
