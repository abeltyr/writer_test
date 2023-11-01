import { getContent, getContents, removeChildrenContent, removeContent } from '@/utils/editor';

export const removedValue = async ({ node }: { node: any }) => {
    const contentId = node.id;
    const nodeParent = node.parentElement;
    node.remove();
    if (nodeParent.children.length === 0) {
        if (nodeParent)
            nodeParent.remove()
    }

    const content = getContent({ id: contentId });
    removeContent({ id: contentId })
    if (content.parentId) {
        removeChildrenContent({ parentId: content.parentId, childId: contentId })
    }
    return true

}