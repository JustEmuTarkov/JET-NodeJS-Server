class Util {
    constructor(){
        this.fileIO = require("./utils/fileIO");
        this.math = require("./utils/math");
        this.logger = require("./utils/logger");
        this.tools = require("./utils/tools");
    }
}

module.exports = new Util();