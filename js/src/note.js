"use strict";
const storage_1 = require('./storage');
let path = require('path');
let fs = require('fs');
let enml = require('enml-js');
class Note extends storage_1.Storage {
    constructor(notebook, data) {
        super();
        this.data = data;
        this.notebook = notebook;
        this.app = notebook.app;
        this.guid = data.guid || 'no-guid';
    }
    getParent() {
        return this.notebook;
    }
    get title() {
        return this.data.title;
    }
    get name() {
        return this.title + '.' + this.guid;
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
    getTags() {
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
    getContentFilePathAndName() {
        return path.join(this.path, 'content-' + this.getFileName() + '.enml');
    }
    getContentTextFilePathAndName() {
        return path.join(this.path, 'content-text-' + this.getFileName() + '.txt');
    }
    getContentHTMLFilePathAndName() {
        return path.join(this.path, 'content-html-' + this.getFileName() + '.html');
    }
    getContent() {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                this.app.noteStore().getNoteContent(self.guid).then((content) => {
                    self.content = content;
                    resolve(content);
                }).catch(reject);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    saveContent() {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                fs.writeFile(this.getContentFilePathAndName(), self.content, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    self.app.log.debug(self.content);
                    fs.writeFile(this.getContentTextFilePathAndName(), enml.PlainTextOfENML(self.content), (err) => {
                        if (err) {
                            return reject(err);
                        }
                        self.app.log.debug(self.content);
                        fs.writeFile(this.getContentHTMLFilePathAndName(), enml.HTMLOfENML(self.content), (err) => {
                            if (err) {
                                return reject(err);
                            }
                            self.app.log.debug(self.content);
                            resolve(self.content);
                        });
                    });
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
exports.Note = Note;
//# sourceMappingURL=note.js.map