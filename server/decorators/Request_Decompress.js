const { default: fastifyCompress } = require('fastify-compress');

module.exports = function (response) {
    return fastifyCompress.inflate(response, function (err, buf) {
        return buf;
    });
}