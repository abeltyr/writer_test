import { childIntegration } from '@/context/editor/childIntegration';
import { useEditor } from '@/context/editor/valueEditor';
import { Editor, EditorStateContentType, SelectorType } from '@/interface/editor';
import { check, cleanUpState, getSelectedElements, nullifyValue } from '@/utils/actions';
import { removedValue } from '@/utils/actions/editor/removedValue';
import { addRoot, getAllChildren, getChildren, getChildrenIndex, getContent, getContents, getRoot, getRootIndex, getRootLength, getRootParentValue, getRoots, insertRoot, removeChildrenContent, removeContent, removeRoot, rootChildCutter, updateContents, updateValueContent, upsetChildren, upsetContent, upsetRoot } from '@/utils/editor/data';
import { getCurrentlyEditedElement, getNestedArray, removeNestedArray, updateNestedArray, updateNestedArrayContent, } from '@/utils/editors';
import { updateCaretToMatch } from '@/utils/editors/editorData/cursor';
import React, { useEffect, } from 'react'
import { v4 } from 'uuid';

export const TextTest = () => {

    const { renderEditorDom } = useEditor();

    useEffect(() => {
        renderEditorDom();

    }, [])

    let currentPosition: number;
    let id: string;
    let inputKey = "";



    return (
        <div
            id="editor"
            className={`py-2 px-4 outline-none cursor-text block whitespace-pre-wrap break-words select-text `}

            suppressContentEditableWarning={true}
            contentEditable
            onDragStart={(event) => {
                console.log("drag started")
                event.preventDefault();
            }}
            onInput={(_) => {
                let { selection, node } = getCurrentlyEditedElement()
                if (node && node.firstChild && selection) {
                    if (node.firstChild.nodeType === 3) {
                        updateValueContent({
                            id: id,
                            value: node.textContent
                        });
                    }
                    else {
                        const parentContent = getContent({ id: node.id })
                        if (!parentContent.parentId) {
                            //TODO: May need a future check
                            check({ node })
                        }
                    }
                    // add data match with the json
                }
            }}
            onKeyDown={async (event: React.KeyboardEvent<HTMLDivElement>) => {

                //fetch the node and section
                const { selection, node } = getCurrentlyEditedElement()

                // get the id of the current editable htmlElement
                id = node.id;

                // get the caretPosition of the current editable htmlElement
                currentPosition = selection!.focusOffset;

                // get the imputed text on the current editable htmlElement
                inputKey = event.key;

                // fetch all the selected texts
                const selectedValues = getSelectedElements();

                // await selectBasedUpdate({ event, selectedValues, selection: selection! })

                if (event.code === "Enter") {
                    event.preventDefault();
                    let contentId = v4();

                    // first check if it is a content has a child or a value

                    // if it has a value check where at the caret is 

                    const currentContent = getContent({ id });
                    const rootId = getRootParentValue({ contentValue: currentContent })
                    const rootContent = getContent({ id: rootId });

                    let contentValue: string | undefined;
                    let newContentValue: string | undefined;

                    if (rootContent.content) {
                        contentValue = rootContent.content.slice(0, currentPosition);
                        newContentValue = rootContent.content.slice(currentPosition, rootContent.content.length + 1);
                        node.textContent = contentValue;
                        updateValueContent({ id: id, value: contentValue })
                        const contentData: EditorStateContentType = {
                            id: contentId,
                            type: "P",
                            className: "",
                            direction: "ltr",
                            indent: 0,
                            content: newContentValue,
                            format: null,
                        }
                        upsetContent({ id: contentId, value: contentData })
                    }
                    else if (rootContent.children) {
                        const data = await rootChildCutter({ contentId: id, parentId: rootContent.children, currentPosition });
                        contentId = data.parentId;
                        const contentData: EditorStateContentType = {
                            id: contentId,
                            type: "P",
                            className: "",
                            direction: "ltr",
                            indent: 0,
                            children: contentId,
                            format: null,
                        }
                        upsetChildren({ parentId: data.parentId, value: data.newChildren });
                        upsetContent({ id: contentData.id, value: contentData })
                    }



                    // if the value is in the middle move the current value to the new one 


                    const rootEditorElement = document.getElementById('editor');

                    if (rootEditorElement) {
                        const content = getContent({ id: contentId })
                        const childElement = childIntegration({
                            editorStateData: content,
                        })
                        console.log("content", childElement);
                        const rootIndex = getRootIndex({ contentId: rootId })
                        const rootLength = getRootLength()

                        console.log("rootIndex", rootIndex);
                        if (rootIndex < rootLength - 1) {
                            const beforeElement = document.getElementById(getRoot({ index: rootIndex + 1 }));
                            insertRoot({ index: rootIndex + 1, contentId })
                            if (beforeElement) {
                                rootEditorElement.insertBefore(childElement, beforeElement)
                            }
                        } else {
                            // TODO: if the below text is empty just move the to the next rather than  
                            addRoot({ contentId })
                            rootEditorElement.appendChild(childElement)
                            console.log("childElement", childElement)
                        }
                        const updateChildElement = childIntegration({
                            editorStateData: rootContent,
                        })
                        const currentChildElement = document.getElementById(rootId)
                        if (currentChildElement)
                            rootEditorElement.replaceChild(updateChildElement, currentChildElement)

                        updateCaretToMatch({ id: contentId, currentPosition: 0, selection: selection! })
                    }
                }
                else if (event.code === "Tab") {
                    event.preventDefault();
                }
                else if (event.code === "Backspace" || event.code === "Delete") {
                    if (selectedValues.length === 0 && node.textContent.length === 1) {
                        event.preventDefault()
                        removedValue({ node });
                    }

                }

                console.log("getContents", getContents())
                console.log("getAllChildren", getAllChildren())
                console.log("getRoots", getRoots())

            }}
            onPaste={(event) => {
                event.preventDefault();
            }}
        />

    )
}





const selectBasedUpdate = (
    {
        selectedValues,
        selection,
        event
    }: {
        selectedValues: SelectorType[],
        selection: Selection,
        event: React.KeyboardEvent<HTMLDivElement>
    }) => {

    if (selectedValues.length > 0 && (event.key.length === 1 || event.code === "Backspace" || event.code === "Delete" || event.code === "Enter")) {
        event.preventDefault()

        // fetch the first and last selected contents
        const firstSelectedValue = selectedValues[0];
        const lastSelectedValue = selectedValues[selectedValues.length - 1];
        const firstContent = JSON.parse(JSON.stringify(getContent({ id: firstSelectedValue.id })))
        const lastContent = JSON.parse(JSON.stringify(getContent({ id: lastSelectedValue.id })))

        let firstRootValue = "-1";
        let lastRootValue = "";

        if (firstContent && lastContent) {
            firstRootValue = getRootParentValue({ contentValue: firstContent })
            lastRootValue = getRootParentValue({ contentValue: lastContent })
        }




        // remove the 
        if (firstRootValue != lastRootValue) {
            const roots = getRoots();
            let startDeleting = false;
            roots.map((value, index) => {
                if (value === lastRootValue) {
                    startDeleting = false;
                }
                if (startDeleting) {
                    const nodeData = document.getElementById(value);
                    nodeData?.remove();
                    removeRoot({ index: index })
                    removeContent({ id: value })
                }
                if (value === firstRootValue) {
                    startDeleting = true;
                }
            })
        }


        let firstSelected = false;

        let finalNodeData: SelectorType | undefined;

        // loop throw the selected text and remove them and there parent if they have been selected as a whole, 
        // if they are partially selected they are modified accordingly
        selectedValues.map(async (value, index) => {
            if (value.fullySelected) {
                await removedValue({ node: value.node })
            } else {
                let updatedText = "";
                let updatedId = value.node.id;
                if (index === 0) {
                    updatedText = value.wholeText.slice(0, value.startPos);
                    value.node.textContent = updatedText
                    updatedId = value.node.id;
                    finalNodeData = value;
                    firstSelected = true;
                }
                else if (index === selectedValues.length - 1) {
                    updatedText = value.wholeText.slice(value.endPos, value.wholeText.length);
                    value.node.textContent = value.wholeText.slice(value.endPos, value.wholeText.length)
                    if (!finalNodeData || event.code === "Delete") {
                        finalNodeData = value;
                        firstSelected = false;
                    }
                }
                await updateValueContent({ id: updatedId, value: updatedText })
            }
        });


        if (finalNodeData) {
            let currentPosition = finalNodeData.startPos;

            if (!firstSelected) {
                currentPosition = 0
            }


            if (event.key) {
                console.log("inputKey", event.key, event.key.length)
                if (event.key.length === 1) {
                    if (firstSelected) {
                        finalNodeData.node.textContent = finalNodeData.node.textContent + event.key;
                        currentPosition = currentPosition + 1;
                    } else {
                        finalNodeData.node.textContent = event.key + finalNodeData.node.textContent;
                        console.log("here");
                        currentPosition = currentPosition + 1;
                    }
                    updateValueContent({ id: finalNodeData.id, value: finalNodeData.node.textContent })
                }
            }
            finalNodeData.node.focus();
            updateCaretToMatch({ currentPosition: currentPosition, id: finalNodeData.id, selection: selection! })
        }

        if (!lastSelectedValue.fullySelected && !firstSelectedValue.fullySelected) {
            console.log("move to the back")
            const firstChildren = getChildren({ parentId: firstRootValue })
            const lastChildren = getChildren({ parentId: lastRootValue })
            const newChildren = { ...firstChildren, ...lastChildren }


        }

        if (!lastSelectedValue.fullySelected && firstSelectedValue.fullySelected) {
            console.log("move to the front")
        }

        if (lastSelectedValue.fullySelected && firstSelectedValue.fullySelected) {
            console.log("move to the front as new")
        }
    }

}