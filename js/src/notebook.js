"use strict";
const storage_1 = require('./storage');
const note_1 = require('./note');
let path = require('path');
let fs = require('fs');
const NOTES_METADATA_RESULT_SPEC = {
    includeTitle: true,
    includeContentLength: true,
    includeCreated: true,
    includeUpdated: true,
    includeDeleted: true,
    includeUpdateSequenceNum: true,
    includeNotebookGuid: true,
    includeTagGuids: true,
    includeAttributes: true,
    includeLargestResourceMime: true,
    includeLargestResourceSize: true
};
class Notebook extends storage_1.Storage {
    constructor(app, data) {
        super();
        this.data = data;
        this.app = app;
        this.notes = [];
    }
    getParent() {
        return this.app;
    }
    get name() {
        return this.data.name;
    }
    get guid() {
        return this.data.guid;
    }
    getNotes(noteFilter = {}, offset = 0, maxNotes = 9999999) {
        let self = this;
        return new Promise((resolve, reject) => {
            noteFilter.notebookGuid = this.guid;
            try {
                self.app.noteStore().findNotesMetadata(noteFilter, offset, maxNotes, NOTES_METADATA_RESULT_SPEC).then((notesMetadata) => {
                    self.notes = [];
                    self.notesMetadata = notesMetadata;
                    self.app.log.info('Got', notesMetadata.totalNotes, ' notes from notebook', self.name);
                    notesMetadata.notes.forEach((noteMetadata) => {
                        self.notes.push(new note_1.Note(self, noteMetadata));
                    });
                    resolve(self.notes);
                }).catch((err) => {
                    reject(err);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    addNote(data) {
        let newNote = new note_1.Note(this, data);
        return newNote.create();
    }
    get notesCount() {
        return this.notes.length;
    }
    getNoteCount() {
        return new Promise((resolve, reject) => {
            this.app.noteStore().getNoteCount().then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    saveAllNotes() {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                self.notes.forEach((note) => {
                    note.save().then(() => {
                        this.log.info(note.name, 'saved to disk');
                    }).catch((err) => {
                        this.log.error(err);
                    });
                });
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
exports.Notebook = Notebook;
//# sourceMappingURL=notebook.js.map