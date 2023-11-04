import { EditorChildrenType, EditorStateContentType, ValueType } from '@/interface/editor';
import { getSecondParentValue, getContent, removeContent, updateValueContent, upsetContent, updateParentContent } from './content';
import { v4 } from 'uuid';


let children: EditorChildrenType = {}


export const getChildren = ({ parentId }: { parentId: string, }) => {
    return children[parentId];
}

export const getAllChildren = () => {
    return children;
}

export const getChildrenIndex = ({ parentId, contentId }: { parentId: string, contentId: string }) => {
    console.log("parentId", parentId)
    console.log("(children[parentId]", children[parentId])
    console.log("contentId", contentId)
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

export const upsetChildren = ({ parentId, value }: { parentId: string, value: ValueType[] }) => {
    children[parentId] = value;
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


export const rootChildCutter = async ({ parentId, contentId, currentPosition }: { parentId: string, contentId: string, currentPosition: number }) => {

    let newChildren: ValueType[] = [];

    const childCutId = await getSecondParentValue({ contentId, id: contentId, finalId: parentId });
    const childIndex = await getChildrenIndex({ contentId: childCutId, parentId: parentId })
    const childrenData = await getChildren({ parentId: parentId })
    const newParentId = v4();
    let currentContentId = contentId

    if (contentId != childCutId)
        currentContentId = childrenData[childIndex].contentId

    const currentContent = getContent({ id: currentContentId })

    await childrenData.slice(childIndex + 1, childrenData.length).forEach((value, index) => {
        newChildren = [...newChildren, {
            contentId: value.contentId,
            parentId: newParentId
        }]
        updateParentContent({ id: value.contentId, parentId: newParentId })
        children[parentId].splice(childIndex + 1, 1)
    })

    let contentValue: string | undefined;
    let newContentValue: string | undefined;

    if (currentContent.content) {
        contentValue = currentContent.content.slice(0, currentPosition);
        newContentValue = currentContent.content.slice(currentPosition, currentContent.content.length + 1);
        // node.textContent = contentValue;
        updateValueContent({ id: currentContent.id, value: contentValue })
        updateParentContent({ id: currentContent.id, parentId: newParentId })
        // updateTextValue({ id: currentContent.id, value: contentValue })
        const contentData: EditorStateContentType = {
            id: v4(),
            type: "P",
            className: "",
            direction: "ltr",
            indent: 0,
            content: newContentValue,
            format: null,
            parentId: newParentId
        }
        upsetContent({ id: contentData.id, value: contentData })
        newChildren = [
            {
                contentId: contentData.id,
                parentId: newParentId

            }, ...newChildren
        ]
    }
    else if (currentContent.children) {
        const childCollection = await rootChildCutter({ contentId, parentId: currentContent.children, currentPosition })
        children[childCollection.parentId] = childCollection.newChildren
        const contentData: EditorStateContentType = {
            ...currentContent,
            id: childCollection.parentId,
            children: childCollection.parentId,
            content: undefined,
            parentId: newParentId
        }
        upsetContent({ id: contentData.id, value: contentData })
        newChildren = [
            {
                contentId: contentData.id,
                parentId: newParentId
            },
            ...newChildren
        ]
    }

    return { newChildren, parentId: newParentId }
}