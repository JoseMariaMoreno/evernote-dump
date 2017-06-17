import { EvernoteApp } from './src/evernote-app';
import { Note } from './src/note';

const config = require( '../config.json' );

const app = new EvernoteApp( config );
app.initialize().then( () => {
    app.getNoteBooks().then( () => {

        app.log.debug('Notebooks count', app.notebooksCount);

        app.saveAllNotebooks().then(() => {
            app.log.debug('Notebooks data saved to files');
        });

        app.getNotebookByName('Contabilidad').getNotes().then((notes: Note[]) => {

            notes.forEach( ( note: Note ) => {
                app.log.debug( note.title );
            });

        }).catch( ( err: Object ) => {
            app.log.error(err);
        });

        /*
         app.getNotebookByName( 'Contabilidad' ).addNote( {
         "title": "El título",
         "content": "El contenido"
         }).then( ( res: any ) => {
         console.log( res );
         }).catch( ( err: any ) => {
         console.error( err );
         });
         */
    });
}).catch( ( err: Object ) => {
    app.log.error( err );
});
