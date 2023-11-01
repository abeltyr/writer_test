import { EditorChildrenType, EditorChildrenValueType, ValueType } from '@/interface/editor';
import { getContent, removeContent } from './content';


let children: EditorChildrenType = {}


export const updateChildren = (value: EditorChildrenType) => {
    children = value;
}

export const upsetChildren = ({ index, value }: { index: string, value: EditorChildrenValueType }) => {
    children[index] = value;
}


export const upsetChildrenValue = ({ parentId, childId, value }: { parentId: string, childId: string, value: ValueType }) => {
    children[parentId][childId] = value;
}

export const addChildren = ({ parentId, childId, value }: { parentId: string, childId: string, value: ValueType }) => {
    children[parentId][childId] = value;
}

export const removeChildrenContent = async ({ parentId, childId }: { parentId: string, childId: string }) => {
    delete children[parentId][childId]
    if (Object.keys(children[parentId]).length === 0) {
        delete children[parentId];
        const data = getContent({ id: parentId });
        removeContent({ id: parentId })
        if (data.parentId) {
            delete children[data.parentId][parentId]
            if (Object.values(children[data.parentId]).length === 0) {
                delete children[data.parentId]
                removeContent({ id: data.parentId })
            }
        }
    }
}


export const getAllChildren = () => {
    return { ...children };
}

export const getChildren = ({ index }: { index: string, }) => {
    return children[index];
}

