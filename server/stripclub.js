const zlib = require("zlib");
class Hooker {

    static cocaineAndBitches(niggaInTheClub) {
        niggaInTheClub.addHook('onRequest', (request, reply, done) => {
            const bodyLength = request.body ? request.body.length : "empty";
            JET.util.logger.logRequest(`|[${request.method}]> ${request.url} [Body Length:${bodyLength}]`);
            if (request.method == "GET") {
                let body = [];
                request.raw.on('data', (chunk) => {
                    body.push(chunk);
                })
                JET.util.logger.logRequest(`|[${request.method}]> ${request.url} [Body Length:${body.length}]`)
                request.body = body;
            }
            if (request.method == "POST") {
                request.raw.on('data', function (data) {
                    zlib.inflate(data, function (err, body) {
                        request.body = body !== undefined && body !== null && body !== "" ? body.toString() : "{}";
                    })
                })
            }
            
            done();
        })

    }
}

module.exports = Hooker;