const zlib = require("zlib");

module.exports = function (response) {
    return zlib.deflate(response, function (err, buf) {
        console.log(response)
        return buf;
    });
}