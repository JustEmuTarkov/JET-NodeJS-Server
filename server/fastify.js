const certificateGenerator = require('./certificategenerator.js');
const routes = require("./routes.js");
const fastify = require('fastify')
const decorators = require("./decorators/decorators.js");
const zlib = require('zlib');

class FastifyServer {
    constructor() {
        this.server = fastify({
            logger: true,
            http2: true,
            prettyPrint: true,
            https: {
                allowHTTP1: true, // fallback support for HTTP1
                key: certificateGenerator.KEY,
                cert: certificateGenerator.CERT
            }
        });

        // Is this shit even correct? IDK send help //
        this.server.addContentTypeParser('application/json', { parseAs: 'buffer' }, function (req, body, done) {
            try {
                if (req.body != null) {
                    var json = JSON.parse(body)
                    done(null, json)
                } else {
                    done(null, null);
                }
            } catch (err) {
                err.statusCode = 400
                done(err, undefined)
            }
        })

        //this.server.register(uWebSocket);
        //this.setWebSocketServer();
        this.defaultDecorators();
        this.server.register(
            require('fastify-compress'),
            {
                encodings: ['deflate'],
                global: true,
                threshold: 0,
            });
        this.server.register(require('@fastify/cookie'), {
            secret: "nigga", // for cookies signature
            parseOptions: {}     // options for parsing cookies
        });

        routes.initializeRoutes(this.server);
    }

    async addRequestDecorator(FunctionName, Function) {
        this.server.decorateRequest(FunctionName, Function);
    }

    async addResponseDecorator(FunctionName, Function) {
        this.server.decorateReply(FunctionName, Function);
    }

    async addGlobalDecorator(FunctionName, Function) {
        this.server.decorate(FunctionName, Function);
    }

    async defaultDecorators() {
        this.addRequestDecorator('reqBody2Json', decorators.bodyToJson);
        this.addRequestDecorator('reqDecompress', decorators.fastifyDecompress);
        this.addResponseDecorator('responseHeader', decorators.headerFormat);
        this.addResponseDecorator('resBSG', decorators.bsgFormat);
        this.addResponseDecorator('resNoBody', decorators.noBodyFormat);
    }

    async startServer() {
        try {
            await this.server.listen(443, '127.0.0.1');
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports.FastifyServer = FastifyServer;