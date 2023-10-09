
export const getCurrentlyEditedElement = () => {
    const selection = window.getSelection();
    if (!selection) return null;

    const node = selection.anchorNode;
    return node && node.nodeType === 3 ? node.parentNode : node;
}




export const getCursorPosition = (id: string) => {
    let position = 0;
    const selection = window.getSelection();

    if (selection != null && selection!.rangeCount !== 0) {
        const range = selection!.getRangeAt(0);
        const preCaretRange = range.cloneRange();

        const contentEditableDiv = document.getElementById(id);
        if (contentEditableDiv) {

            preCaretRange.selectNodeContents(contentEditableDiv);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            position = preCaretRange.toString().length;
        }

    }

    return position;
}
