import { Storage } from './storage';
import { Notebook } from './notebook';
export declare class Note extends Storage {
    data: any;
    private notebook;
    private app;
    private guid;
    constructor(notebook: Notebook, data: any);
    getParent(): Notebook;
    title: string;
    name: string;
    getNote(): Promise<any>;
    private getResource(resourceGuid);
    getAttachments(): Promise<any>;
    getTags(): Promise<any>;
    create(): Promise<Note>;
    getContentFilePathAndName(): string;
    getContentTextFilePathAndName(): string;
    getContentHTMLFilePathAndName(): string;
    getContent(): Promise<any>;
    saveContent(): Promise<any>;
}
