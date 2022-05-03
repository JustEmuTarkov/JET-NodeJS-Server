const zlib = require("zlib");
class Hooker {

    static cocaineAndBitches(niggaInTheClub) {
        niggaInTheClub.addHook('onRequest', (request, reply, done) => {
            if (request.method == "GET") {
                let body = [];
                request.raw.on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
                    //let data = Buffer.concat(body);
                });
                JET.util.logger.logRequest(`|[${request.method}]> ${request.url} [Body Length:${body.length}]`)
                request.body = body;
            }
            if (request.method == "POST") {
                let body = [];
                request.raw.on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
                    zlib.inflate(Buffer.concat(body), function(err, data){
                        if (data !== undefined) {
                            request.body = data !== typeof "undefined" && data !== null && data !== "" ? data.toString() : "{}";
                        }
                        const bodyLength = request.body ? request.body.length : "empty";
                        JET.util.logger.logRequest(`|[${request.method}]> ${request.url} [Body Length:${bodyLength}]`);
                        JET.util.logger.logDebug(request.body);
                        
                    })
                })
            }
            
            done();
        })

    }
}

module.exports = Hooker;