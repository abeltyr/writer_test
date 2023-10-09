import { Editor } from '@/interface/editor';
import { htmlGenerator } from './htmlGenerator';
import { renderToString } from 'react-dom/server';

export const generate = (biirData: Editor) => {
    let data: any[] = [];
    biirData.editorState.root.map((value, index) => {
        const htmlComponent = htmlGenerator({ editorState: value, indexLevel: [index] });
        data = [...data, renderToString(htmlComponent)]
    })

    return data.join('');
}