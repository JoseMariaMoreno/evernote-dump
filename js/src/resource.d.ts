import { Storage } from './storage';
import { Note } from './note';
import { EvernoteApp } from './evernote-app';
export declare class Resource extends Storage {
    data: any;
    private note;
    private guid;
    private resourceFileContent;
    private resourceFileType;
    private resourceFileName;
    constructor(note: Note, data: any);
    getApp(): EvernoteApp;
    path: string;
    getDataToSave(): any;
    getFilePathAndName(): string;
    initialize(): Promise<any>;
    getParent(): Note;
}
