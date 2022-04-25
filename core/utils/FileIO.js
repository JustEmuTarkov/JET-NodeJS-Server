const fs = require("fs");
const fsPromises = require('fs').promises

class FileIO {

    /**
     * Retrieve absolute path using shortened path.
     * @param {string} path 
     * @returns {string} absolutePath
     */
    static getAbsolutePathFrom(path){
        const startsWithSlash = path[0] == "/";
        if(startsWithSlash){
            return `${process.cwd()}${path}`;
        }
        return `${process.cwd()}/${path}`;
    }
    static readFile = (filePath, useRelative = true) => {
        return fs.readFileSync((useRelative) ? this.getAbsolutePathFrom(filePath) : filePath);
    }

    /**
     * Overwrite if file exists, else create file with content in it.
     * @param {string} filePath
     * @param {*} data 
     * @param {boolean} useRelative 
     */
    static writeFile = (filePath, data, useRelative = true) => {
        fs.writeFileSync((useRelative) ? this.getAbsolutePathFrom(filePath) : filePath, data, {encoding: "utf8", flag: "w+"});
    }

    /**
     * Read a file and parse it to JSON.
     * @param {string} filePath 
     * @param {boolean} useRelative 
     * @returns 
     */
    static readParsed = (filePath, useRelative = true) => {
        return JSON.parse(this.readFile(filePath, useRelative), 'utf8');
    }

    static createFileWriteStream = (filePath, useRelative = true) => {
        return fs.createWriteStream((useRelative) ? this.getAbsolutePathFrom(filePath) : filePath, { flags: 'w' });
    }


    /**
     * Async read function mean to be used in an async function.
     * Used for database loading  mainly, in a promise.all closure.
     * @param {string} file path of the file to  be read
     * @returns {Promise}
     */
    static readFileAsync = (filePath, useRelative = true) => {
        return fsPromises.readFile((useRelative) ? this.getAbsolutePathFrom(filePath) : filePath, 'utf-8');
    }

    static fileExist = (filePath, useRelative = true) => {
        return fs.existsSync(this.getAbsolutePathFrom(filePath, useRelative));
    }

    /**
     * Retrieve all directories present at a given path.
     * @param {string} path 
     * @returns {Array}
     */
    static getDirectoriesFrom = (path, useRelative = true) => {
        const tempPath = (useRelative) ? this.getAbsolutePathFrom(path) : path;
        return fs.readdirSync(tempPath).filter(function (file) {
            return fs.statSync(`${tempPath}/${file}`).isDirectory();
        });
    }

    /**
     * Retrieve all files present at a given path.
     * @param {string} path 
     * @returns {Array}
     */
    static getFilesFrom = (path, useRelative = true) => {
        const tempPath = (useRelative) ? this.getAbsolutePathFrom(path) : path;
        return fs.readdirSync(tempPath).filter(function (file) {
            return fs.statSync(`${tempPath}/${file}`).isFile();
        });
    }
    
}
module.exports = FileIO;