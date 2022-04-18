class Utils {
    constructor(){
        this.FileIO = require("./Utils/FileIO");
        this.Math = require("./Utils/Math");
        this.Logger = require("./Utils/Logger");
        this.Tools = require("./Utils/Tools");
    }
}

module.exports = new Utils();