import { EditorContentType, EditorStateContentType } from '@/interface/editor';


export let contents: EditorContentType = {}


export const updateContents = (value: EditorContentType) => {
    contents = value;
}

export const upsetContent = ({ id, value }: { id: string, value: EditorStateContentType }) => {
    contents[id] = value;
}

export const removeContent = ({ id }: { id: string, }) => {
    delete contents[id];
}


export const getContent = ({ id }: { id: string, }) => {
    return contents[id];
}