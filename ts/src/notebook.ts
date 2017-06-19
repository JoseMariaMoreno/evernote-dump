/**
 * Notebook objects that save its data to local file and load all its notes
 * By José María Moreno
 */

import { EvernoteApp } from './evernote-app';
import { Storage } from './storage';
import { Note } from './note';
import { NoteFilter } from './interfaces/note-filter.interface';
import { NotesMetadataResultSpec } from './interfaces/notes-metadata-result-spec.interface'

let path = require( 'path' );
let fs = require( 'fs' );

/**
 * Metadata result specification
 * @type {{includeTitle: boolean; includeContentLength: boolean; includeCreated: boolean; includeUpdated: boolean; includeDeleted: boolean; includeUpdateSequenceNum: boolean; includeNotebookGuid: boolean; includeTagGuids: boolean; includeAttributes: boolean; includeLargestResourceMime: boolean; includeLargestResourceSize: boolean}}
 */
const NOTES_METADATA_RESULT_SPEC: NotesMetadataResultSpec = {
  includeTitle: true,
  includeContentLength: true,
  includeCreated: true,
  includeUpdated: true,
  includeDeleted: true,
  includeUpdateSequenceNum: true,
  includeNotebookGuid: true,
  includeTagGuids: true,
  includeAttributes: true,
  includeLargestResourceMime: true,
  includeLargestResourceSize: true
};

export class Notebook extends Storage {

  // Public objects
  public app: EvernoteApp;
  public data: any;

  // Private objects
  private notes: Note[];
  private notesMetadata: any;

  public constructor( app: EvernoteApp, data: any ) {
    super();
    this.data = data;
    this.app = app;
    this.notes = [];
  }

  /**
   * Returns the app
   * @returns {EvernoteApp}
   */
  public getParent(): EvernoteApp {
    return this.app;
  }

  /**
   * Returns the name of the notebook
   */
  public get name(): string {
    return this.data.name;
  }

  /**
   * Returns the notebook guid
   * @returns {string}
   */
  public get guid(): string {
    return this.data.guid;
  }

  /**
   * Download all this notebook notes from Evernote
   * @returns {Promise<T>}
   */
  public getNotes( noteFilter: NoteFilter = {}, offset: number = 0, maxNotes: number = 9999999 ): Promise<any> {
    let self = this;
    return new Promise( ( resolve, reject ) => {

      // Force notes from this notebook
      noteFilter.notebookGuid = this.guid;

      try {

        self.app.noteStore().findNotesMetadata( noteFilter, offset, maxNotes, NOTES_METADATA_RESULT_SPEC ).then( ( notesMetadata: any ) => {

          // Empty notes array
          self.notes = [];

          // Store metadata
          self.notesMetadata = notesMetadata;

          self.app.log.info( 'Got', notesMetadata.totalNotes, ' notes from notebook', self.name );

          // Populate notes array
          notesMetadata.notes.forEach( ( noteMetadata: any ) => {
            self.notes.push( new Note( self, noteMetadata ) );
          } );

          resolve( self.notes );

        } ).catch( ( err: any ) => {
          reject( err );
        } );

      } catch ( err ) {
        reject( err );
      }

    } )
  }

  /**
   * Add a new note in this notebook
   * @param data
   * @returns {Promise<Note>}
   */
  public addNote( data: any ): Promise<Note> {
    let newNote = new Note( this, data );
    return newNote.create();

  }

  /**
   * Returns the number of notes we have cached
   * @returns {number}
   */
  public get notesCount(): number {
    return this.notes.length;
  }

  /**
   * Returns the number of notes in this notebook (in Evernote server, not in local cache)
   * @returns {Promise<T>}
   */
  public getNoteCount(): Promise<any> {
    return new Promise( ( resolve, reject ) => {
      this.app.noteStore().getNoteCount().then( ( res: any ) => {
        resolve( res );
      } ).catch( ( err: any ) => {
        reject( err );
      } );
    } );
  }

  /**
   * Save all notes (stored in cache)
   * @returns {Promise<T>}
   */
  public saveAllNotes(): Promise<any> {
    let self = this;
    return new Promise( ( resolve, reject ) => {
      try {

        self.notes.forEach( ( note: Note ) => {
          note.save().then( () => {
            this.log.info( note.name, 'saved to disk' );
          } ).catch( ( err: any ) => {
            this.log.error( err );
          } );
        } );
        resolve();
      } catch ( err ) {
        reject( err );
      }

    } )
  }

}
