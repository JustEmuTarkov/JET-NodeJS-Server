const zlib = require("zlib");

class Hooker {

    static cocaineAndBitches(niggaInTheClub) {
        niggaInTheClub.addHook('onRequest', (request, reply, done) => {
            if (request.method == "GET") {
                let body = [];
                request.req.on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
                    console.log(body.toString());
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
                    console.log(body[0]);
                    zlib.inflate(body[0], function(err, data){
                        console.log(data)
                        if (data !== undefined) {
                            request.body = data !== typeof "undefined" && data !== null && data !== "" ? data.toString() : "{}";
                        }
                    })
                })
            }
            
            done();
        })

    }
}

module.exports = Hooker;