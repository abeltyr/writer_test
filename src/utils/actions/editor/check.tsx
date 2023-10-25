import { spanChild } from '@/context/editor/typography';
import { Editor, EditorStateChildren } from '@/interface/editor';
import { appendNestedArray, getNestedArray, updateNestedArray, updateNestedArrayContent } from '@/utils/editors';
import { updateCaretToMatch } from '@/utils/editors/editorData/cursor';
import { v4 } from 'uuid';

export const check = async (
    {
        node,
        indexLevel,
        updatedDataView
    }: {
        node: Node,
        indexLevel: number[],
        updatedDataView: Editor
    }
) => {
    let nextIndexLevel = [...indexLevel];
    nextIndexLevel.pop();
    nextIndexLevel[nextIndexLevel.length - 1] = nextIndexLevel[nextIndexLevel.length - 1] + 1;

    for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].nodeType === 3) {
            if (node.childNodes[i + 1]) {
                const initialData = node.childNodes[i].textContent ?? " ";
                node.childNodes[i + 1].textContent = initialData + node.childNodes[i + 1].textContent!;
                node.childNodes[i].remove();

                const childNode = node.childNodes[i];

                if (childNode instanceof Element) {
                    const selection = window.getSelection();
                    updateCaretToMatch(childNode.id, initialData?.length, selection!);
                }
                updateNestedArrayContent({
                    editorState: updatedDataView.editorState.root,
                    indexLevel: [...nextIndexLevel, i],
                    value: node.childNodes[i].textContent
                },
                )
            } else {
                const id = v4();
                const initialData = node.childNodes[i].textContent ?? " ";

                const nextValue = getNestedArray({

                    editorState: updatedDataView.editorState.root,
                    indexLevel: [...nextIndexLevel],
                })

                console.log("nextValue",);
                const data: EditorStateChildren = {
                    id: id,
                    type: "P",
                    className: "",
                    direction: "",
                    indent: 0,
                    content: initialData
                }

                const childElement = spanChild({
                    editorStateData: { ...data },
                    indexLevel: [...nextIndexLevel],
                })

                await node.childNodes[i].remove();
                await node.appendChild(childElement)
                const selection = window.getSelection();
                await updateCaretToMatch(childElement.id, initialData?.length, selection!);

                if (nextValue) {
                    nextValue.content = node.childNodes[i].textContent ?? "";
                    updateNestedArray({
                        editorState: updatedDataView.editorState.root,
                        indexLevel: [...nextIndexLevel, i],
                        value: nextValue
                    },)
                } else {
                    appendNestedArray({
                        editorState: updatedDataView.editorState.root,
                        indexLevel: [...nextIndexLevel],
                        value: data,
                    })
                }




            }
        }
    }
}