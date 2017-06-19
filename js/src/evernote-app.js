"use strict";
const notebook_1 = require('./notebook');
const storage_1 = require('./storage');
let Evernote = require('evernote');
let fs = require('fs');
let path = require('path');
class EvernoteApp extends storage_1.Storage {
    constructor(config) {
        super();
        this.DATA_PATH = 'evernote-data';
        this._notebooks = [];
        this.config = config;
        this.client = new Evernote.Client({
            token: config.token,
            sandbox: false,
            china: false
        });
    }
    noteStore() {
        return this.client.getNoteStore();
    }
    userStore() {
        return this.client.getUserStore();
    }
    user() {
        return this.userStore().getUser().then((user) => {
            return user;
        }).catch((err) => {
            this.log.error(err);
        });
    }
    getNoteBooks() {
        let self = this;
        return new Promise((resolve, reject) => {
            this.noteStore().listNotebooks().then(function (notebooks) {
                self.log.debug('Notebooks received', notebooks.map((nb) => nb.name));
                Promise.all(notebooks.map((notebook) => {
                    return self.addNotebook(notebook);
                })).then(resolve).catch(reject);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    addNotebook(data) {
        let self = this;
        return new Promise((resolve, reject) => {
            let notebook;
            try {
                notebook = new notebook_1.Notebook(self, data);
                notebook.initialize().then(() => {
                    self._notebooks.push(notebook);
                    resolve();
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getNotebookByName(name) {
        console.log('Searching for', name);
        return this.notebooks.filter((notebook) => {
            console.log(notebook);
            return notebook.name == name;
        })[0];
    }
    get notebooksCount() {
        return this.notebooks.length;
    }
    get notebooks() {
        return this._notebooks;
    }
    get path() {
        return path.join((this.config.dataPath || __dirname), this.DATA_PATH);
    }
    saveAllNotebooks() {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                self.notebooks.forEach((notebook) => {
                    notebook.save().then(() => {
                        this.log.info(notebook.name, 'saved to disk');
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
exports.EvernoteApp = EvernoteApp;
//# sourceMappingURL=evernote-app.js.map