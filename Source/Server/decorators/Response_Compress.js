const { default: fastifyCompress } = require("fastify-compress");
//const zlib = require("zlib");

module.exports = function (response) {
    return fastifyCompress.deflate(response, function (err, buf) {
        return buf;
    });
/*     return zlib.deflate(response, function (err, buf) {
        return buf;
    }); */
}