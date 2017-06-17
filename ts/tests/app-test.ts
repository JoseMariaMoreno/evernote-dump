import * as App from '../index';
import { expect, use } from 'chai';
import * as ChaiString from 'chai-string';

const config = require( '../../config.json' );

use( ChaiString );

describe( 'Evernote dump', () => {
    describe( 'Storage', () => {
        let storage: App.Storage;

        before(() => {
            storage = new App.Storage();
        });

        it('should be file system', done => {
            expect( storage.type ).to.startWith( 'File' );
            done();
        });

        it('should have path ending with evernote-data', done => {
            expect( storage.path ).to.endsWith( 'evernote-data' );
            done();
        });

    });

    describe( 'App', () => {
        let evernoteApp: App.EvernoteApp;

        before( () => {
            evernoteApp = new App.EvernoteApp( config );
        });

        it('should be empty by default', done => {
            expect( evernoteApp.notebooksCount ).to.equal( 0 );
            done();
        });

        it( 'should have client', done => {
            expect( evernoteApp.client ).to.exist;
            done();
        });
    });

    describe( 'NoteBook', () => {
        let evernoteApp: App.EvernoteApp;
        let notebook: App.Notebook;

        before( () => {
            evernoteApp = new App.EvernoteApp( config );
            notebook = new App.Notebook( evernoteApp, {} );
        });

        it( 'should be empty by default', done => {
            expect( notebook.notesCount ).to.equal( 0 );
            done();
        });

        it( 'should have client', done => {
            expect( notebook.app.client ).to.exist;
            done();
        });
    });

    describe( 'Note', () => {
        let evernoteApp: App.EvernoteApp;
        let notebook: App.Notebook;
        let note: App.Note;

        before( () => {
            evernoteApp = new App.EvernoteApp( config );
            notebook = new App.Notebook( evernoteApp, {} );
            note = new App.Note( notebook, {} );
        });

        it( 'should be empty by default', done => {
            expect( evernoteApp.notebooksCount ).to.equal( 0 );
            done();
        });

        it( 'should have client', done => {
            expect( evernoteApp.client ).to.exist;
            done();
        });
    });

});
