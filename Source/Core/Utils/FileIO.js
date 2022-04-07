const fs = require("fs");
class FileIO {
    constructor(){}
    ReadFile = (FileName) =>
    {
        return fs.readFileSync(FileName);
    }
    CreateFileWriteStream = (file) =>
    {
        return fs.createWriteStream(file, { flags: 'w' });
    }
}
module.exports = new FileIO();