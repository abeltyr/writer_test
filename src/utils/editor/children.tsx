import { EditorChildrenType, ValueType } from '@/interface/editor';


export let children: EditorChildrenType = {}


export const updateChildren = (value: EditorChildrenType) => {
    children = value;
}

export const upsetChildren = ({ id, value }: { id: string, value: ValueType[] }) => {
    children[id] = value;
}

export const addChildren = ({ id, value }: { id: string, value: ValueType }) => {
    children[id].push(value);
}

export const removeChildren = ({ id }: { id: string, }) => {
    delete children[id];
}

export const removeChildrenContent = async ({ id, contentId }: { id: string, contentId: string, }) => {
    let data = children[id].filter(item => item.contentId !== contentId);
    children[id] = [...data];

    console.log(children[id])
}


export const getChildren = ({ id }: { id: string, }) => {
    return children[id];
}

export const getChildrenIndex = ({ id, contentId }: { id: string, contentId: string }) => {
    let indexData;

    children[id].map((value, index) => {
        if (value.contentId === contentId) {
            indexData = index;
        }
    });

    return indexData;
}