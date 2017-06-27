"use strict";
let path = require('path');
let fs = require('fs');
let rimraf = require('rimraf');
let log4js = require('log4js');
class Storage {
    constructor() {
        this.type = 'File system';
        this.data = {};
        log4js.configure({
            appenders: [
                { type: 'console' },
                { type: 'file', filename: 'logs/app.log', category: 'app' }
            ]
        });
        this.log = log4js.getLogger('app');
    }
    initialize() {
        var self = this;
        return new Promise((resolve, reject) => {
            try {
                rimraf(this.path, (err) => {
                    if (err) {
                        reject(err);
                    }
                    fs.mkdir(this.path, (err) => {
                        if (err) {
                            this.log.error(err);
                        }
                        this.log.debug('Created folder', this.path);
                        resolve(self);
                    });
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getParent() {
        return this;
    }
    get name() {
        return 'storage-class';
    }
    get path() {
        return path.join(this.getParent().path, this.textToFileName(this.name));
    }
    getDataToSave() {
        return JSON.stringify(this.data, null, 2);
    }
    save() {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                console.log('Creating', self.getFilePathAndName());
                fs.writeFile(self.getFilePathAndName(), self.getDataToSave(), (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    setData(data) {
        this.data = data;
    }
    getFileName() {
        return this.textToFileName(this.name) || 'no-file-name';
    }
    getFilePathAndName() {
        return path.join(this.path, this.getFileName() + '.json');
    }
    textNormalize(s) {
        let r = s.toLowerCase();
        r = r.replace(new RegExp('[àáâãäå]', 'g'), 'a');
        r = r.replace(new RegExp('æ', 'g'), 'ae');
        r = r.replace(new RegExp('ç', 'g'), 'c');
        r = r.replace(new RegExp('[èéêë]', 'g'), 'e');
        r = r.replace(new RegExp('[ìíîï]', 'g'), 'i');
        r = r.replace(new RegExp('ñ', 'g'), 'n');
        r = r.replace(new RegExp('[òóôõö]', 'g'), 'o');
        r = r.replace(new RegExp('œ', 'g'), 'oe');
        r = r.replace(new RegExp('[ùúûü]', 'g'), 'u');
        r = r.replace(new RegExp('[ýÿ]', 'g'), 'y');
        r = r.replace('/', '');
        return r;
    }
    ;
    textToFileName(s) {
        let r = this.textNormalize(s);
        r = r.replace(new RegExp("\\s", 'g'), "-");
        r = r.replace(new RegExp("\\W", 'g'), "-");
        return r;
    }
    ;
}
exports.Storage = Storage;
//# sourceMappingURL=storage.js.map