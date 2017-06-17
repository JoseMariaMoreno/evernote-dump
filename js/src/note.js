"use strict";
let path = require('path');
let fs = require('fs');
class Note {
    constructor(notebook, data) {
        this.data = data;
        this.notebook = notebook;
        this.app = notebook.app;
        this.guid = data.guid || 'no-guid';
        fs.mkdir(this.path, (err) => {
            if (err) {
                this.notebook.app.log.error(err);
            }
            this.notebook.app.log.debug('Created note folder', this.path, this.data);
        });
    }
    get title() {
        return this.data.title;
    }
    get name() {
        return this.title + '.' + this.guid;
    }
    get path() {
        return path.join(this.notebook.path, this.name);
    }
    getAttachments() {
        return new Promise((resolve, reject) => {
            try {
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getTabs() {
        return new Promise((resolve, reject) => {
            try {
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    create() {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                let newNote = new self.app.client.Note();
                newNote.title = self.data.title;
                newNote.content = self.data.content;
                newNote.notebookGuid = self.notebook.guid;
                self.app.noteStore().createNote(newNote, (err, note) => {
                    if (err) {
                        self.app.log.error(err);
                        reject(err);
                    }
                    else {
                        resolve(self);
                    }
                });
            }
            catch (err) {
                self.app.log.error(err);
                reject(err);
            }
        });
    }
}
exports.Note = Note;
//# sourceMappingURL=note.js.map