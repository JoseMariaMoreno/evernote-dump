import { EvernoteApp } from './evernote-app';
import { Storage } from './storage';
import { Note } from './note';
import { NoteFilter } from './interfaces/note-filter.interface';
export declare class Notebook extends Storage {
    app: EvernoteApp;
    data: any;
    private notes;
    private notesMetadata;
    constructor(app: EvernoteApp, data: any);
    getParent(): EvernoteApp;
    name: string;
    guid: string;
    getNotes(noteFilter?: NoteFilter, offset?: number, maxNotes?: number): Promise<any>;
    addNote(data: any): Promise<Note>;
    notesCount: number;
    getNoteCount(): Promise<any>;
}
