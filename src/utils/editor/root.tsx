import { EditorRootType, ValueType } from '@/interface/editor';


let root: EditorRootType = {}


export const updateRoot = (value: EditorRootType) => {
    root = value;
}

export const upsetRoot = ({ index, value }: { index: string, value: string }) => {
    root[index] = value;
}


export const removeRoot = ({ contentId }: { contentId: string, }) => {
    delete root[contentId];
}

export const getRoots = () => {
    return { ...root };
}

export const getRoot = ({ index }: { index: string, }) => {
    return root[index];
}

