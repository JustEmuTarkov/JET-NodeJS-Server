const fs = require("fs");
const fsPromises = require('fs').promises
class FileIO {
    static readFile(FileName) {
        return fs.readFileSync(FileName);
    }

    static createFileWriteStream(file){
        return fs.createWriteStream(file, { flags: 'w' });
    }

    static readFileAsync(file){
        return  fsPromises.readFile(file, 'utf-8');
    }
    
}
module.exports = FileIO;