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
                    if(request.url.indexOf("launcher") == -1 && request.url.indexOf("mode") == -1){
                        // default game requests
                        zlib.inflate(chunk, function(err, data){
                            console.log(data);
                            if (data !== undefined) {
                                request.body = data !== typeof "undefined" && data !== null && data !== "" ? data.toString() : "{}";
                            }
                            const bodyLength = request.body ? request.body.length : "empty";
                            JET.util.logger.logRequest(`|[${request.method}]> ${request.url} [Body Length:${bodyLength}]`);
                            JET.util.logger.logDebug(request.body);
                        })
                        return;
                    }
                    body.push(chunk);
                }).on('end', () => {
                    if(request.url.indexOf("launcher") == -1 && request.url.indexOf("mode") == -1){
                        return;
                    }
                    // launcher and other requests that chunk data !!!
                    if(body.length > 0 && typeof body[0] == "string"){ console.log(body); body = Buffer.from(body, "utf-8"); }
                    console.log("[body2]", typeof body, body)
                    if(typeof body[0] != "string" && typeof body == "object") body = Buffer.concat(body);
                    console.log("[body3]", typeof body, body)
                    zlib.inflate(body, function(err, data){
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