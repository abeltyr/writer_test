import { spanChild } from '@/context/editor/typography';
import { Editor, EditorStateChildren } from '@/interface/editor';
import { appendNestedArray } from '@/utils/editors';
import { v4 } from 'uuid';
import { check } from './check';

export const nextCreate = ({
    inputKey,
    nextIndexLevel,
    indexLevel,
    node,
    updatedDataView
}:
    {
        inputKey: string,
        nextIndexLevel: number[],
        indexLevel: number[],
        node: Node,
        updatedDataView: Editor
    }) => {

    // check({ node, nextIndexLevel });

    const createId = v4();
    const createCurrentPosition = 1;

    // const data: EditorStateChildren = {
    //     id: createId,
    //     type: "P",
    //     className: "",
    //     direction: "",
    //     indent: 0,
    //     content: inputKey
    // }
    // const childElement = spanChild({
    //     editorStateData: { ...data },
    //     indexLevel: [...nextIndexLevel],
    // })
    // if (node.lastChild)
    //     node.lastChild!.remove();

    // node.appendChild(childElement)
    // appendNestedArray({
    //     editorState: updatedDataView.editorState.root, indexLevel: indexLevel,
    //     value: data
    // })
    // console.log("create a new field", updatedDataView)

    return {
        createId,
        createCurrentPosition
    }
}