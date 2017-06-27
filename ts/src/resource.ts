/**
 * Note resource object that save all its data to local files
 * By José María Moreno
 */

import { Storage } from './storage';
import { Note } from './note';
import { EvernoteApp } from './evernote-app';

let path = require( 'path' );
let fs = require( 'fs' );

export class Resource extends Storage {

  // Public objects
  public data: any;

  // Private objects
  private note: Note;
  private guid: string;
  private resourceFileContent: any;
  private resourceFileType: string;
  private resourceFileName: string;

  public constructor( note: Note, data: any ) {
    super();

    this.data = data || {};
    this.note = note;
    this.guid = data.guid || 'no-guid'; // TODO: Throw error

  }

  public getApp(): EvernoteApp {
    return this.getParent().getParent().getParent();
  }

  /**
   * Get the folder path, for resources it is the same folder as note
   * @returns {string}
   */
  public get path(): string {
    return this.getParent().path;
  }

  /**
   * Returns the data object NOT in text format, to save to local file.
   * @returns {any}
   */
  public getDataToSave(): any {
    return this.resourceFileContent;
  }
  /**
   * Returne the path and the file name
   * @returns {string}
   */
  public getFilePathAndName(): string {
    return path.join( this.path, this.resourceFileName );
  }

  public initialize(): Promise<any> {
    let self = this;
    return new Promise( ( resolve, reject ) => {

      try {
        self.getApp().noteStore().getResource( this.guid, true, false, true, false ).then( ( resource: any ) => {
          self.resourceFileContent = resource.data.body;
          self.resourceFileType = resource.mime;
          self.resourceFileName = resource.attributes.fileName;
          self.getApp().log.debug( self.resourceFileName, 'created' );

          // And call storage method to save the file
          super.save().then( resolve ).catch( reject );

        }).catch( reject );

      } catch( err ) {
        reject( err );
      }
    })

  }


  /**
   * Returns the notebook
   * @returns {EvernoteApp}
   */
  public getParent(): Note {
    return this.note;
  }

}
