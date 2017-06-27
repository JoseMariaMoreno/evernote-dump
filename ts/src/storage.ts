/**
 * File Storage class, inherited in other classe in order to save Evernote data in local files
 * Override if you want to save, i.e., to a database
 */

let path = require( 'path' );
let fs = require( 'fs' );
let rimraf = require( 'rimraf' );
let log4js = require( 'log4js' );

export class Storage {

  public data: any;
  public log: any;

  private root: string;
  private fileName: string;

  public type: string = 'File system';

  public constructor() {
    this.data = {};

    // Set the log component
    log4js.configure( {
      appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/app.log', category: 'app' }
      ]
    } );

    this.log = log4js.getLogger( 'app' );

  }

  /**
   * Creates the local folder
   * @returns {Promise<T>}
   */
  public initialize(): Promise<any> {
    var self = this;
    return new Promise( ( resolve, reject ) => {
      try {
        // Create the folder
        rimraf( this.path, ( err: any ) => {
          if ( err ) {
            reject( err );
          }
          fs.mkdir( this.path, ( err: any ) => {
            if ( err ) {
              this.log.error( err );
            }
            this.log.debug( 'Created folder', this.path );
            resolve( self );
          } );
        } )

      } catch ( err ) {
        reject( err );
      }

    } )

  }

  /**
   * Returns the parent object, among other thinks, to get the parent path folder
   * @returns {Storage}
   */
  public getParent(): any {
    return this;
  }

  /**
   * Returns the entity name, override in other classes
   * @returns {string}
   */
  public get name(): string {
    return 'storage-class';
  }

  /**
   * Get the folder path, overrided in other classes
   * @returns {string}
   */
  public get path(): string {
    return path.join( this.getParent().path, this.textToFileName( this.name ) );
  }

  /**
   * Returns the data object in text format, to save to local file.
   * @returns {string}
   */
  public getDataToSave(): string {
    return JSON.stringify( this.data, null, 2 );
  }

  /**
   * Save data to file
   * @returns {Promise<T>}
   */
  public save(): Promise<any> {
    let self = this;
    return new Promise( ( resolve, reject ) => {
      try {
        console.log( 'Creating', self.getFilePathAndName() );
        fs.writeFile( self.getFilePathAndName(), self.getDataToSave(), ( err: any ) => {
          if ( err ) {
            return reject( err );
          }
          resolve();
        } );
      } catch ( err ) {
        reject( err );
      }
    } );
  }

  /**
   * Set de data object
   * @param data
   */
  public setData( data: any ): void {
    this.data = data;
  }

  /**
   * Returns the file name
   * @returns {string|string}
   */
  public getFileName(): string {
    return this.textToFileName( this.name ) || 'no-file-name';
  }

  /**
   * Returne the path and the file name
   * @returns {string}
   */
  public getFilePathAndName(): string {
    return path.join( this.path, this.getFileName() + '.json' );
  }

  /**
   * Replace non-valid chars from a file name
   * @param s
   * @returns {string}
   */
  private textNormalize( s: string ): string {
    let r = s.toLowerCase();
    r = r.replace( new RegExp( '[àáâãäå]', 'g' ), 'a' );
    r = r.replace( new RegExp( 'æ', 'g' ), 'ae' );
    r = r.replace( new RegExp( 'ç', 'g' ), 'c' );
    r = r.replace( new RegExp( '[èéêë]', 'g' ), 'e' );
    r = r.replace( new RegExp( '[ìíîï]', 'g' ), 'i' );
    r = r.replace( new RegExp( 'ñ', 'g' ), 'n' );
    r = r.replace( new RegExp( '[òóôõö]', 'g' ), 'o' );
    r = r.replace( new RegExp( 'œ', 'g' ), 'oe' );
    r = r.replace( new RegExp( '[ùúûü]', 'g' ), 'u' );
    r = r.replace( new RegExp( '[ýÿ]', 'g' ), 'y' );
    r = r.replace( '/', '' );
    return r;
  };

  /**
   * Converts a string to chars used as a file name
   * @param s
   * @returns {string}
   */
  private textToFileName( s: string ): string {

    let r = this.textNormalize( s );
    r = r.replace( new RegExp( "\\s", 'g' ), "-" );
    r = r.replace( new RegExp( "\\W", 'g' ), "-" );
    return r;
  };

}
