import { Notebook } from './notebook';
import { EvernoteApp } from './evernote-app';

let path = require( 'path' );
let fs = require( 'fs' );

export class Note {

    private data: any;
    private notebook: Notebook;
    private app: EvernoteApp;
    private guid: string;

    public constructor( notebook: Notebook, data: any ) {
        this.data = data;
        this.notebook = notebook;
        this.app = notebook.app;
        this.guid = data.guid || 'no-guid'; // TODO: Throw error

        // Create the folder
        fs.mkdir( this.path, ( err: any ) => {
            if ( err ) {
                this.notebook.app.log.error( err );
            }
            this.notebook.app.log.debug( 'Created note folder', this.path, this.data );

        } );

    }

    public get title(): string {
        return this.data.title;
    }

    /**
     * For notes, name its the title & guid
     * @returns {string}
     */
    public get name(): string {
        return this.title + '.' + this.guid;
    }

    public get path(): string {
        return path.join( this.notebook.path, this.name );
    }

    /**
     * Download all this notebook attachments from Evernote
     * @returns {Promise<T>}
     */
    public getAttachments(): Promise<any> {
        return new Promise( ( resolve, reject ) => {
            try {
                resolve();
            } catch( err ) {
                reject( err );
            }

        })
    }

    /**
     * Download all this notebook tags from Evernote
     * @returns {Promise<T>}
     */
    public getTabs(): Promise<any> {
        return new Promise( ( resolve, reject ) => {
            try {

                resolve();
            } catch( err ) {
                reject( err );
            }

        })
    }

    public create(): Promise<Note> {
        let self = this;
        return new Promise( ( resolve, reject ) => {
            try {
                let newNote = new self.app.client.Note();
                newNote.title = self.data.title;
                newNote.content = self.data.content;
                newNote.notebookGuid = self.notebook.guid;

                self.app.noteStore().createNote( newNote, ( err: any, note: any ) => {
                    if ( err ) {
                        // Something was wrong with the note data
                        // See EDAMErrorCode enumeration for error code explanation
                        // http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
                        self.app.log.error( err );
                        reject( err );
                    } else {
                        resolve( self );
                    }
                });

            } catch ( err ) {
                self.app.log.error( err );
                reject( err );
            }

        });
    }

}
