export const updateCaretToMatch = (id: string, currentPosition: number, selection: Selection) => {

    if (selection !== null) {

        const contentEditableElement = document.getElementById(id);

        if (contentEditableElement) {

            const range = selection!.getRangeAt(0);

            if (contentEditableElement!.firstChild && contentEditableElement!.firstChild!.nodeType === 3)
                range.setStart(contentEditableElement!.firstChild!, currentPosition)
            else
                range.setStart(contentEditableElement!, 0)


            range.collapse(true);

            selection!.removeAllRanges();
            selection!.addRange(range);

            contentEditableElement!.focus();
        }
    }
}