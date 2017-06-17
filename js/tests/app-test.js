"use strict";
const App = require('../index');
const chai_1 = require('chai');
const ChaiString = require('chai-string');
const config = require('../../config.json');
chai_1.use(ChaiString);
describe('Evernote dump', () => {
    describe('Storage', () => {
        let storage;
        before(() => {
            storage = new App.Storage();
        });
        it('should be file system', done => {
            chai_1.expect(storage.type).to.startWith('File');
            done();
        });
        it('should have path ending with evernote-data', done => {
            chai_1.expect(storage.path).to.endsWith('evernote-data');
            done();
        });
    });
    describe('App', () => {
        let evernoteApp;
        before(() => {
            evernoteApp = new App.EvernoteApp(config);
        });
        it('should be empty by default', done => {
            chai_1.expect(evernoteApp.notebooksCount).to.equal(0);
            done();
        });
        it('should have client', done => {
            chai_1.expect(evernoteApp.client).to.exist;
            done();
        });
    });
    describe('NoteBook', () => {
        let evernoteApp;
        let notebook;
        before(() => {
            evernoteApp = new App.EvernoteApp(config);
            notebook = new App.Notebook(evernoteApp, {});
        });
        it('should be empty by default', done => {
            chai_1.expect(notebook.notesCount).to.equal(0);
            done();
        });
        it('should have client', done => {
            chai_1.expect(notebook.app.client).to.exist;
            done();
        });
    });
    describe('Note', () => {
        let evernoteApp;
        let notebook;
        let note;
        before(() => {
            evernoteApp = new App.EvernoteApp(config);
            notebook = new App.Notebook(evernoteApp, {});
            note = new App.Note(notebook, {});
        });
        it('should be empty by default', done => {
            chai_1.expect(evernoteApp.notebooksCount).to.equal(0);
            done();
        });
        it('should have client', done => {
            chai_1.expect(evernoteApp.client).to.exist;
            done();
        });
    });
});
//# sourceMappingURL=app-test.js.map