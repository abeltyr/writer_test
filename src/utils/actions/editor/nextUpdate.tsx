import { Editor, EditorStateChildren } from '@/interface/editor';
import { updateNestedArray } from '@/utils/editors';
import { check } from './check';

export const nextUpdate = ({
    inputKey,
    nextIndexLevel,
    fetchNextChild,
    node,
    updatedDataView
}:
    {
        inputKey: string,
        nextIndexLevel: number[],
        fetchNextChild: EditorStateChildren
        node: Node,
        updatedDataView: Editor
    }) => {


    // check({ node, nextIndexLevel });

    const updatedId = fetchNextChild.id;
    const updatedCurrentPosition = 1;

    // if (fetchNextChild.content) {
    //     fetchNextChild.content = inputKey + fetchNextChild.content;
    // }
    // if (fetchNextChild.children && fetchNextChild.children.length >= 1) {
    //     fetchNextChild.children![0].content = inputKey + fetchNextChild.children![0].content;
    // }

    // updateNestedArray(
    //     updatedDataView.editorState.root,
    //     [...nextIndexLevel],
    //     fetchNextChild
    // );

    // console.log("update the next field", node, updatedDataView)

    return {
        updatedId,
        updatedCurrentPosition
    }
}