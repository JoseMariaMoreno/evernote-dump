/**
 * Main class with the Evernote client object and
 * methods to load and dump all notebooks
 * By José María Moreno
 */

import { Notebook } from './notebook';
import { Storage } from './storage';

let Evernote = require( 'evernote' );
let fs = require( 'fs' );
let path = require( 'path' );

export class EvernoteApp extends Storage {

  // Private objects
  private DATA_PATH: string = 'evernote-data';
  private _notebooks: Notebook[] = [];

  // Public objects
  public config: any;
  public client: any;
  public webApiUrlPrefix: string;


  public constructor( config: any ) {
    super();

    this.config = config;

    // Create the Evernote client connection
    this.client = new Evernote.Client( {
      token: config.token,
      sandbox: false,
      china: false
    } );


  }

  public initialize(): Promise<any> {
    let self = this;
    this.log.debug( 'App initialize overrided' );
    return new Promise( ( resolve, reject ) => {
      try {
        self.userStore().getPublicUserInfo( self.config.username )
          .then( ( userInfo: any ) => {
            self.log.debug( userInfo );
            self.webApiUrlPrefix  = userInfo.webApiUrlPrefix;
            super.initialize()
          } ).catch( ( err: any ) => reject( err ) );
      } catch( err ) {
        reject( err );
      }
    });


  }

  /**
   * Returns Evernote Note Store API Object
   * @returns {any}
   */
  public noteStore(): any {
    return this.client.getNoteStore();
  }

  /**
   * Returns the Evernote User Store object
   * @returns {any}
   */
  public userStore(): any {
    return this.client.getUserStore();
  }

  /**
   * Return Evernote user information
   * @returns {Promise<TResult|T>}
   */
  public user(): any {
    return this.userStore().getUser().then( ( user: any ) => {
      return user;
    } ).catch( ( err: any ) => {
      this.log.error( err );
    } )
  }

  /**
   * Get all notebooks from Evernote
   * @returns {Promise<T>}
   */
  public getNoteBooks(): Promise<any> {
    let self = this;
    return new Promise( ( resolve, reject ) => {
      this.noteStore().listNotebooks().then( function ( notebooks: any ) {
        self.log.debug( 'Notebooks received', notebooks.map( ( nb: any ) => nb.name ) );
        Promise.all(
          notebooks.map( ( notebook: Notebook ) => {
            return self.addNotebook( notebook );
          } )
        ).then( resolve ).catch( reject );

      } ).catch( ( err: any ) => {
        reject( err );
      } );
    } );
  }

  /**
   * Add a notebook
   */
  public addNotebook( data: any ): Promise<any> {
    let self = this;
    return new Promise( ( resolve, reject ) => {
      let notebook: Notebook;
      try {
        notebook = new Notebook( self, data );
        notebook.initialize().then( () => {
          self._notebooks.push( notebook );
          resolve();
        } );
      } catch ( err ) {
        reject( err );
      }

    } )

  }

  /**
   * Returns a notebook by its name
   * @param name
   * @returns {Notebook}
   */
  public getNotebookByName( name: string ): Notebook {
    console.log( 'Searching for', name );
    return this.notebooks.filter( ( notebook: Notebook ) => {
      console.log( notebook );
      return notebook.name == name;
    } )[ 0 ];
  }

  /**
   * Returns the number of notebooks
   * @returns {number}
   */
  public get notebooksCount(): number {
    return this.notebooks.length;
  }

  /**
   * Returns all notebooks stored in cache
   * @returns {Notebook[]}
   */
  public get notebooks(): Notebook[] {
    return this._notebooks;
  }

  /**
   * returns the target path
   * @returns {string}
   */
  public get path(): string {
    return path.join( ( this.config.dataPath || __dirname ), this.DATA_PATH );
  }

  /**
   * Save all notebooks data in local folder
   * @returns {Promise<T>}
   */
  public saveAllNotebooks(): Promise<any> {
    let self = this;
    return new Promise( ( resolve, reject ) => {
      try {

        self.notebooks.forEach( ( notebook: Notebook ) => {
          notebook.save().then( () => {
            this.log.info( notebook.name, 'saved to disk' );
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

