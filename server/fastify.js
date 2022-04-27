const certificateGenerator = require('./certificategenerator.js');
const routes = require("./routes.js");
const fastify = require('fastify')

class FastifyServer {
    constructor(){
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
        routes.initializeRoutes(this.server);
    }
    async addRequestDecorator(FunctionName, Function){
        this.server.decorateRequest(FunctionName, Function);
    }
    async addResponseDecorator(FunctionName, Function){
        this.server.decorateReply(FunctionName, Function);
    }
    async addGlobalDecorator(FunctionName, Function){
        this.server.decorate(FunctionName, Function);
    }
    async defaultDecorators(){
        this.addRequestDecorator('reqBody2Json', require("./decorators/Request_BodyToJson.js"));
        this.addRequestDecorator('reqDecompress', require("./decorators/Request_Decompress.js"));
        this.addResponseDecorator('responseHeader', require("./decorators/Response_Header.js"));
        this.addResponseDecorator('resBSG', require("./decorators/Response_BSG.js"));
        this.addResponseDecorator('resNoBody', require("./decorators/Response_NoBody.js"));
        this.addResponseDecorator('resCompress', require("./decorators/Response_Compress.js"));
    }
    //async setWebSocketServer(){
    //    this.server.ready(err => {
    //        if(err) throw err;
//
    //        this.server.ws.on("connection", socket => {
    //            socket.on("message", msg => console.log(msg));
    //            socket.on("close", () => console.log("Closed Connection"));
    //        })
    //    });
    //}
    //async addRoute(path, func, type = "get"){
    //    switch(type){
    //        case "get": 
    //            this.server.get(path, func);
    //            return;
    //        case "post": 
    //            this.server.post(path, func);
    //            return;
    //        case "get&post":
    //            this.server.get(path, func);
    //            this.server.post(path, func);
    //            return;
    //        default: 
    //            console.log(`Route is not defined: for ${path} as ${type}`);
    //            return;
    //    }
    //}
    async startServer(){
        try
        {
            await this.server.listen(443);
        } catch(error)
        {
            console.log(error);
        }
    }
}

module.exports.FastifyServer = FastifyServer;