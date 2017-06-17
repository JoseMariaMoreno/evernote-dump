import { EvernoteApp } from './evernote-app';
export declare class Storage {
    app: EvernoteApp;
    data: any;
    log: any;
    private root;
    private fileName;
    type: string;
    constructor();
    initialize(): Promise<any>;
    getParent(): any;
    name: string;
    path: string;
    getDataToSave(): string;
    save(): Promise<any>;
    setData(data: any): void;
    getFileName(): string;
    getFilePathAndName(): string;
    private textNormalize(s);
    private textToFileName(s);
}