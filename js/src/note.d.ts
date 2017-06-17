import { Notebook } from './notebook';
export declare class Note {
    private data;
    private notebook;
    private app;
    private guid;
    constructor(notebook: Notebook, data: any);
    title: string;
    name: string;
    path: string;
    getAttachments(): Promise<any>;
    getTabs(): Promise<any>;
    create(): Promise<Note>;
}
