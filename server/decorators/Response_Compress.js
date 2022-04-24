const { default: fastifyCompress } = require("fastify-compress");

module.exports = function (response) {
    return fastifyCompress.deflate(response, function (err, buf) {
        return buf;
    });
}