"use strict";
const storage_1 = require('./storage');
let path = require('path');
let fs = require('fs');
class Resource extends storage_1.Storage {
    constructor(note, data) {
        super();
        this.data = data || {};
        this.note = note;
        this.guid = data.guid || 'no-guid';
    }
    getApp() {
        return this.getParent().getParent().getParent();
    }
    get path() {
        return this.getParent().path;
    }
    getDataToSave() {
        return this.resourceFileContent;
    }
    getFilePathAndName() {
        return path.join(this.path, this.resourceFileName);
    }
    initialize() {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                self.getApp().noteStore().getResource(this.guid, true, false, true, false).then((resource) => {
                    self.resourceFileContent = resource.data.body;
                    self.resourceFileType = resource.mime;
                    self.resourceFileName = resource.attributes.fileName;
                    self.getApp().log.debug(self.resourceFileName, 'created');
                    super.save().then(resolve).catch(reject);
                }).catch(reject);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getParent() {
        return this.note;
    }
}
exports.Resource = Resource;
//# sourceMappingURL=resource.js.map