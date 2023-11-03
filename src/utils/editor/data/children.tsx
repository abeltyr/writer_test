import { EditorChildrenType, ValueType } from '@/interface/editor';
import { getContent, removeContent } from './content';


let children: EditorChildrenType = {}


export const getChildren = ({ index }: { index: string, }) => {
    return children[index];
}

export const getAllChildren = () => {
    return children;
}

export const getChildrenIndex = ({ parentId, contentId }: { parentId: string, contentId: string }) => {
    if (children[parentId]) {
        return children[parentId].findIndex(value => value.contentId === contentId);
    }
    else {
        return -1;
    }
}

export const updateChildren = (value: EditorChildrenType) => {
    children = value;
}

export const upsetChildren = ({ index, value }: { index: string, value: ValueType[] }) => {
    children[index] = value;
}

// TODO: check if this will be used
export const updateChildrenValue = (
    {
        parentId,
        contentId
    }: {
        parentId: string,
        contentId: string
    }) => {
    const contentIndex = getChildrenIndex({ contentId, parentId })
    if (children[parentId] && contentIndex) {
        children[parentId][contentIndex] = {
            contentId,
            parentId,
        };
    }
}

export const addChildren = (
    {
        parentId,
        value,
    }: {
        parentId: string,
        value: ValueType
    }) => {
    const index = getChildrenIndex({ parentId, contentId: value.contentId })
    if (!index)
        children[parentId].push(value);
}


export const insertChildren = ({ parentId, value, index }: { parentId: string, value: ValueType, index: number }) => {
    if (children[parentId] && index <= children[parentId].length) {
        children[parentId].splice(index, 0, value);
    }
}


export const moveChildren = (
    {
        parentId,
        currentIndex,
        newIndex
    }: {
        parentId: string,
        currentIndex: number
        newIndex: number
    }) => {
    if (children[parentId] && children[parentId][currentIndex] && newIndex <= children[parentId].length) {
        const childValue = children[parentId][currentIndex];
        children[parentId].splice(newIndex, 0, childValue);
        children[parentId].splice(currentIndex, 1);
    }
}


export const mergeChildren = (
    {
        firstChildId,
        lastChildId,
        firstChildIndex,
        lastChildIndex,
    }: {
        firstChildId: string,
        lastChildId: string,
        firstChildIndex: number
        lastChildIndex: number
        forward?: boolean
    }) => {
    if (children[firstChildId] && children[lastChildId]) {
        let firstChild = [...children[firstChildId]];
        let lastChild = [...children[lastChildId]];
        firstChild = firstChild.slice(0, firstChildIndex);;
        lastChild = lastChild.slice(lastChildIndex, children[lastChildId].length - 1);

        const newChild = [...firstChild, ...lastChild];
        children[firstChildId] = newChild;
        delete children[lastChildId];
    }
}

export const removeChildren = ({ parentId }: { parentId: string }) => {
    if (children[parentId]) {
        const removingChild: ValueType[] = JSON.parse(JSON.stringify(
            children[parentId]));
        removingChild.map((value, _) => {
            removeChildrenContent({ contentId: value.contentId, parentId });
        })
    }
}

export const removeChildrenContent = async ({ parentId, contentId }: { parentId: string, contentId: string }) => {
    const contentIndex = getChildrenIndex({ contentId, parentId })
    if (contentIndex >= 0) {
        children[parentId].splice(contentIndex, 1)
        if (Object.keys(children[parentId]).length === 0) {
            delete children[parentId];
            const data = getContent({ id: parentId });
            if (data.parentId) {
                removeChildrenContent({ contentId: parentId, parentId: data.parentId })
            }
        }
        removeContent({ id: contentId })
    }
}

