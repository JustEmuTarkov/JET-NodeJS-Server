const fs = require("fs");
const fsPromises = require('fs').promises
class FileIO {
    static readFile(FileName) {
        return fs.readFileSync(FileName);
    }

    static createFileWriteStream(file){
        return fs.createWriteStream(file, { flags: 'w' });
    }

    /**
     * Async read function mean to be used in an async function.
     * Used for database loading  mainly, in a promise.all closure.
     * @param {string} file path of the file to  be read
     * @returns {Promise}
     */
    static readFileAsync(file){
        return fsPromises.readFile(file, 'utf-8');
    }

    /**
     * Retrieve all directories present at a given path.
     * @param {string} path 
     * @returns {Array}
     */
    static getDirectories(path){
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path+'/'+file).isDirectory();
        });
    }

    /**
     * Retrieve all files present at a given path.
     * @param {string} path 
     * @returns {Array}
     */
    static getFilesInDirectory(path){
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path+'/'+file).isFile();
        });
    }
    
}
module.exports = FileIO;