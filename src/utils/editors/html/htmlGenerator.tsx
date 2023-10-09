import { EditorStateChildren } from '@/interface/editor';
import { TypographyA, TypographyH1, TypographyP, TypographySpan } from '@/components/typographyElement';


export const DefaultRun = ({ editorState, indexLevel }: { editorState: EditorStateChildren, indexLevel: number[] }) => {
    let htmlValue: React.JSX.Element;
    if (editorState.children != null) {
        htmlValue =
            <>
                {editorState.children?.map((value, index) => {
                    let newIndexLevel: number[] = indexLevel;
                    newIndexLevel = [...newIndexLevel, index]
                    return htmlGenerator({ editorState: value, indexLevel: newIndexLevel });
                })}
            </>
    }
    else if (editorState.content != null) {
        htmlValue =
            <TypographySpan editorState={editorState} indexLevel={indexLevel} skipValidation={true} />
    }
    else {
        htmlValue = <br></br>
    }
    return htmlValue;
}


export const htmlGenerator = ({ editorState, indexLevel }: { editorState: EditorStateChildren, indexLevel: number[] }) => {

    return <>
        <TypographyH1 editorState={editorState} indexLevel={indexLevel} />
        <TypographyA editorState={editorState} indexLevel={indexLevel} />
        <TypographySpan editorState={editorState} indexLevel={indexLevel} />
        <TypographyP editorState={editorState} indexLevel={indexLevel} />
    </>;
}
