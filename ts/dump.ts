/**
 * Dump all notebooks and notes to local path
 * By José María Moreno
 */

import { EvernoteApp } from './src/evernote-app';
import { Notebook } from './src/notebook';
import { Note } from './src/note';

const config = require( '../config.json' );

const app = new EvernoteApp( config );
app.initialize().then( () => {
  app.getNoteBooks().then( () => {

    app.log.debug( 'Notebooks count', app.notebooksCount );

    app.saveAllNotebooks().then( () => {
      app.log.debug( 'Notebooks data saved to files' );
    } );

    app.notebooks.forEach( ( notebook: Notebook ) => {
      notebook.getNotes().then( ( notes: Note[] ) => {

        notes.forEach( ( note: Note ) => {
          note.initialize()
            .then( () => note.save() )
            .then( () => note.getContent() )
            .then( () => note.saveContent() )
            .then( () => {
              app.log.debug( note.title, 'saved' );
            }).catch( ( err: any ) => {
            app.log.error( err );
          })
        } );

      } ).catch( ( err: Object ) => {
        app.log.error( err );
      } );
    });


  } );
} ).catch( ( err: Object ) => {
  app.log.error( err );
} );
