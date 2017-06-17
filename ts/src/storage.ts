import { EvernoteApp } from './evernote-app';


let path = require( 'path' );
let fs = require( 'fs' );
let rimraf = require( 'rimraf' );
let log4js = require( 'log4js' );

export class Storage {

  public app: EvernoteApp;
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

  public initialize(): Promise<any> {
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
            resolve();
          } );
        } )

      } catch ( err ) {
        reject( err );
      }

    } )

  }

  public getParent(): any {
    return this;
  }

  public get name(): string {
    return 'storage-class';
  }

  public get path(): string {
    return path.join( this.getParent().path, this.textToFileName( this.name ) );
  }

  public getDataToSave(): string {
    return JSON.stringify( this.data, null, 2 );
  }

  public save(): Promise<any> {
    return new Promise( ( resolve, reject ) => {
      try {
        fs.writeFile( this.getFilePathAndName(), this.getDataToSave(), ( err: any ) => {
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

  public setData( data: any ): void {
    this.data = data;
  }


  public getFileName(): string {
    return this.textToFileName( this.name ) || 'no-file-name';
  }

  public getFilePathAndName(): string {
    return path.join( this.path, this.getFileName() );
  }


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

  private textToFileName( s: string ): string {

    let r = this.textNormalize( s );
    r = r.replace( new RegExp( "\\s", 'g' ), "-" );
    r = r.replace( new RegExp( "\\W", 'g' ), "-" );
    return r;
  };

}
