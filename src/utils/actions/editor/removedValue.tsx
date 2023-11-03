import { getContent, removeChildrenContent, removeContent } from '@/utils/editor/data';

export const removedValue = ({ node }: { node: any }) => {
    const contentId = node.id;
    const nodeParent = node.parentElement;
    node.remove();

    if (nodeParent && nodeParent.children.length === 0)
        nodeParent.remove()

    const content = getContent({ id: contentId });
    if (content.parentId) {
        removeChildrenContent({ parentId: content.parentId, contentId: contentId })
    } else {
        removeContent({ id: contentId })

    }

    return true

}