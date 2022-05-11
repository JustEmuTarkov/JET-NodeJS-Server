const { fastInflate } = require("./decorators/decorators");

class StripClub {

    

    static talkToHooker(niggaInTheClub) {
        niggaInTheClub.addHook('preValidation', (request, reply, done) => {
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
                    fastInflate(data, function (err, body) {
                        request.body = body !== undefined && body !== null && body !== "" ? body.toString() : "{}";
                    })
                })
            }

            done();
        })
    }
}

module.exports = StripClub;