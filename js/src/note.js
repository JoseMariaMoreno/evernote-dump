"use strict";
const storage_1 = require('./storage');
const resource_1 = require('./resource');
let path = require('path');
let fs = require('fs');
let enml = require('enml-js');
class Note extends storage_1.Storage {
    constructor(notebook, data) {
        super();
        this.data = data || {};
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
    getNote() {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                self.app.noteStore().getNote(self.guid, true, false, true, true).then((data) => {
                    self.data = data;
                    resolve(data);
                }).catch(reject);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getResources() {
        let self = this;
        let addResource = (resourceData) => {
            let resource = new resource_1.Resource(self, resourceData);
            return resource.initialize();
        };
        return Promise.all(self.data.resources.map((resource) => {
            return addResource(resource);
        }));
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
                    self.data.content = content;
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
                fs.writeFile(this.getContentFilePathAndName(), self.data.content, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    self.app.log.debug(self.data.content);
                    fs.writeFile(this.getContentTextFilePathAndName(), enml.PlainTextOfENML(self.data.content), (err) => {
                        if (err) {
                            return reject(err);
                        }
                        self.app.log.debug(self.data.content);
                        fs.writeFile(this.getContentHTMLFilePathAndName(), enml.HTMLOfENML(self.data.content), (err) => {
                            if (err) {
                                return reject(err);
                            }
                            self.app.log.debug(self.data.content);
                            resolve(self.data.content);
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