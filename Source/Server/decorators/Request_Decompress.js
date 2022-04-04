const zlib = require("zlib");
module.exports = function (response) {
    return zlib.inflate(response, function (err, buf) {
        return buf;
    });
}