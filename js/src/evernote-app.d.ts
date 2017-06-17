import { Notebook } from './notebook';
import { Storage } from './storage';
export declare class EvernoteApp extends Storage {
    private DATA_PATH;
    private _notebooks;
    config: any;
    client: any;
    constructor(config: any);
    noteStore(): any;
    userStore(): any;
    user(): any;
    getNoteBooks(): Promise<any>;
    addNotebook(data: any): Promise<any>;
    getNotebookByName(name: string): Notebook;
    notebooksCount: number;
    notebooks: Notebook[];
    path: string;
    saveAllNotebooks(): Promise<any>;
}
