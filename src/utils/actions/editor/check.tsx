import { spanChild } from '@/context/editor/typography';
import { EditorStateContentType } from '@/interface/editor';
import { addChildren, updateValueContent, upsetContent } from '@/utils/editor/data';
import { updateCaretToMatch } from '@/utils/editors/editorData/cursor';
import { v4 } from 'uuid';

export const check = async (
    {
        node,
    }: {
        node: Node,
    }
) => {

    let parentId: string = "";

    if (node instanceof Element) {
        parentId = node.id;
    }

    for (let i = 0; i < node.childNodes.length; i++) {

        if (node.childNodes[i].nodeType === 3) {
            console.log(i, node.childNodes[i + 1], node.childNodes[i], node.childNodes[i].nodeType);
            if (node.childNodes[i + 1]) {
                const initialData = node.childNodes[i].textContent ?? " ";
                node.childNodes[i + 1].textContent = initialData + node.childNodes[i + 1].textContent!;
                node.childNodes[i].remove();

                const childNode = node.childNodes[i];
                let id: string = "";
                if (childNode instanceof Element) {
                    const selection = window.getSelection();
                    id = childNode.id;
                    updateCaretToMatch({ id: id, currentPosition: initialData?.length, selection: selection! });
                }
                if (id.length > 0) {
                    // updateValueContent({
                    //     id: id!,
                    //     value: node.childNodes[i].textContent ?? "",
                    // })
                }
            } else {
                const id = v4();
                const initialData = node.childNodes[i].textContent ?? " ";

                const data: EditorStateContentType = {
                    id: id,
                    type: "P",
                    className: "",
                    direction: "",
                    indent: 0,
                    content: initialData
                }

                const childElement = spanChild(
                    {
                        editorStateData: data,
                    }
                )

                await node.childNodes[i].remove();
                await node.appendChild(childElement)
                const selection = window.getSelection();
                await updateCaretToMatch({ id: childElement.id, currentPosition: initialData?.length, selection: selection! });

                // addChildren({
                //     parentId: parentId,
                //     childId: id,
                //     value: {
                //         contentId: id,
                //         parentId: parentId,
                //     },
                // })
                // upsetContent({ id: id, value: data });
            }
        }
    }
}