import { EditorRootType } from '@/interface/editor';
import { getContent, removeContent } from './content';
import { removeChildren } from './children';


let root: EditorRootType = []

export const getRoot = ({ index }: { index: number, }) => {
    return root[index];
}

export const getRoots = () => {
    return [...root];
}


export const getRootLength = () => {
    return root.length;
}

export const getRootIndex = ({ contentId }: { contentId: string }) => {
    return root.findIndex(value => value === contentId);
}

export const updateRoot = (value: EditorRootType) => {
    root = value;
}

export const upsetRoot = ({ index, value }: { index: number, value: string }) => {
    root[index] = value;
}

export const addRoot = ({ contentId }: { contentId: string }) => {
    const index = getRootIndex({ contentId })
    if (index < 0)
        root.push(contentId);
}

export const insertRoot = ({ contentId, index }: { contentId: string, index: number }) => {
    if (index <= root.length) {
        root.splice(index, 0, contentId);
    }
}

export const moveRoot = (
    {
        currentIndex,
        newIndex
    }: {
        currentIndex: number
        newIndex: number
    }) => {

    if (root[currentIndex] && newIndex <= root.length) {
        const childValue = root[currentIndex];
        root.splice(newIndex, 0, childValue);
        root.splice(currentIndex, 1);
    }
}


export const removeRoot = async ({ index }: { index: number, }) => {
    if (root[index]) {
        const content = getContent({ id: root[index] })

        if (content) {
            if (content.children) {
                await removeChildren({ parentId: content.children })
            }
        }
        root.splice(index, 1);
    }
}


