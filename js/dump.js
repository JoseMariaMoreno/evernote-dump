"use strict";
const evernote_app_1 = require('./src/evernote-app');
const config = require('../config.json');
let app = new evernote_app_1.EvernoteApp(config);
app.initialize().then(() => {
    app.getNoteBooks().then(() => {
        app.log.debug('Notebooks count', app.notebooksCount);
        app.saveAllNotebooks().then(() => {
            app.log.debug('Notebooks data saved to files');
        });
        app.getNotebookByName('Contabilidad').getNotes().then((notes) => {
            notes.forEach((note) => {
                app.log.debug(note.title);
            });
        }).catch((err) => {
            app.log.error(err);
        });
    });
}).catch((err) => {
    app.log.error(err);
});
//# sourceMappingURL=dump.js.map