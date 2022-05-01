const zlib = require("zlib");

class Hooker {

    static cocaineAndBitches(niggaInTheClub) {
        niggaInTheClub.addHook('onRequest', (request, reply, done) => {
            if (request.method == "GET") {
                let body = [];
                request.req.on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
                    let data = Buffer.concat(body);
                    console.log(data.toString());
                });
                request.body = body;
            }
            if (request.method == "POST") {
                let body = [];
                request.req.on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
                    console.log(body);
                    let data = Buffer.concat(body);
                    console.log(data);
                    zlib.inflate(data, function(err, body){
                        if (body !== undefined) {
                            request.body = body !== typeof "undefined" && body !== null && body !== "" ? body.toString() : "{}";
                        }
                    })
                })
            }
            done();
        })

    }
}

module.exports = Hooker;