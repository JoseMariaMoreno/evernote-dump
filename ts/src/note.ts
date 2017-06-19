/**
 * Note object that save all its data to local files
 * By José María Moreno
 */

import { Storage } from './storage';
import { Notebook } from './notebook';
import { EvernoteApp } from './evernote-app';

let path = require( 'path' );
let fs = require( 'fs' );
let enml = require( 'enml-js' );

export class Note extends Storage {

  // Public objects
  public data: any;

  // Private objects
  private notebook: Notebook;
  private app: EvernoteApp;
  private guid: string;
  private content: Object;

  public constructor( notebook: Notebook, data: any ) {
    super();

    this.data = data;
    this.notebook = notebook;
    this.app = notebook.app;
    this.guid = data.guid || 'no-guid'; // TODO: Throw error

  }

  /**
   * Returns the notebook
   * @returns {EvernoteApp}
   */
  public getParent(): Notebook {
    return this.notebook;
  }

  /**
   * Get note title
   * @returns {string}
   */
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

  /**
   * Download all this notebook attachments from Evernote
   * @returns {Promise<T>}
   */
  public getAttachments(): Promise<any> {
    return new Promise( ( resolve, reject ) => {
      try {
        resolve();
      } catch ( err ) {
        reject( err );
      }

    } )
  }

  /**
   * Download all this notebook tags from Evernote
   * @returns {Promise<T>}
   */
  public getTags(): Promise<any> {
    return new Promise( ( resolve, reject ) => {
      try {

        resolve();
      } catch ( err ) {
        reject( err );
      }

    } )
  }

  /**
   * Create a new Evernote note
   * @returns {Promise<T>}
   */
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
        } );

      } catch ( err ) {
        self.app.log.error( err );
        reject( err );
      }

    } );
  }

  /**
   * Return the content file path
   * @returns {string}
   */
  public getContentFilePathAndName(): string {
    return path.join( this.path, 'content-' + this.getFileName() + '.enml' );
  }

  /**
   * Return the content text file path
   * @returns {string}
   */
  public getContentTextFilePathAndName(): string {
    return path.join( this.path, 'content-text-' + this.getFileName() + '.txt' );
  }

  /**
   * Return the content html file path
   * @returns {string}
   */
  public getContentHTMLFilePathAndName(): string {
    return path.join( this.path, 'content-html-' + this.getFileName() + '.html' );
  }

  /**
   * Get the note content in ENML format
   * @returns {Promise<T>}
   */
  public getContent(): Promise<any> {
    let self = this;
    return new Promise( ( resolve, reject ) => {
      try {
        this.app.noteStore().getNoteContent( self.guid ).then( ( content: any ) => {

          self.content = content;
          resolve( content );

        }).catch( reject );

      } catch( err ) {
        reject( err )
      }

    });
  }

  /**
   * Save content
   * @returns {Promise<T>}
   */
  public saveContent(): Promise<any> {
    let self = this;
    return new Promise( ( resolve, reject ) => {
      try {

          fs.writeFile( this.getContentFilePathAndName(), self.content, ( err: any ) => {
            if ( err ) {
              return reject( err );
            }
            self.app.log.debug( self.content );

            fs.writeFile( this.getContentTextFilePathAndName(), enml.PlainTextOfENML( self.content ), ( err: any ) => {
              if ( err ) {
                return reject( err );
              }
              self.app.log.debug( self.content );
              fs.writeFile( this.getContentHTMLFilePathAndName(), enml.HTMLOfENML( self.content ), ( err: any ) => {
                if ( err ) {
                  return reject( err );
                }
                self.app.log.debug( self.content );
                resolve( self.content );
              } );
            } );

          } );

      } catch( err ) {
        reject( err )
      }

    });
  }

}
