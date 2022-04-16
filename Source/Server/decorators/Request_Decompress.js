const { default: fastifyCompress } = require('fastify-compress');
//const zlib = require("zlib");







module.exports = function (response) {

    return fastifyCompress.inflate(response, function (err, buf) {
        return buf;
    });

/*     return zlib.inflate(response, function (err, buf) {
        return buf;
    }); */
}