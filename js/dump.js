"use strict";
const evernote_app_1 = require('./src/evernote-app');
const config = require('../config.json');
const app = new evernote_app_1.EvernoteApp(config);
app.initialize().then(() => {
    app.getNoteBooks().then(() => {
        app.log.debug('Notebooks count', app.notebooksCount);
        app.saveAllNotebooks().then(() => {
            app.log.debug('Notebooks data saved to files');
        });
        app.notebooks
            .filter((notebook) => {
            return notebook.name == 'Contabilidad';
        })
            .forEach((notebook) => {
            notebook.getNotes({}, 38, 9999).then((notes) => {
                notes.forEach((note) => {
                    note.initialize()
                        .then(() => note.getNote())
                        .then(() => note.save())
                        .then(() => note.saveContent())
                        .then(() => note.getResources())
                        .then(() => {
                        app.log.debug(note.title, 'saved');
                    }).catch((err) => {
                        app.log.error(err);
                    });
                });
            }).catch((err) => {
                app.log.error(err);
            });
        });
    });
}).catch((err) => {
    app.log.error(err);
});
//# sourceMappingURL=dump.js.map