const certificateGenerator = require('./certificategenerator.js');
const routes = require("./routes.js");
const fastifyWS = require("fastify-ws");
const fastify = require('fastify')

class FastifyServer {
    constructor(){
        this.Server = fastify({
            logger: true,
            http2: true,
            prettyPrint: true,
            https: {
                allowHTTP1: true, // fallback support for HTTP1
                key: certificateGenerator.KEY,
                cert: certificateGenerator.CERT
            }
        });
        this.Server.register(fastifyWS);
        this.SetWebSocketServer();
        this.DefaultDecorators();
        routes.initializeRoutes(this.Server);
    }
    async AddRequestDecorator(FunctionName, Function){
        this.Server.decorateRequest(FunctionName, Function);
    }
    async AddResponseDecorator(FunctionName, Function){
        this.Server.decorateReply(FunctionName, Function);
    }
    async AddGlobalDecorator(FunctionName, Function){
        this.Server.decorate(FunctionName, Function);
    }
    async DefaultDecorators(){
        this.AddRequestDecorator('Req_Body2Json', require("./decorators/Request_BodyToJson.js"));
        this.AddRequestDecorator('Req_Decompress', require("./decorators/Request_Decompress.js"));
        this.AddResponseDecorator('ResponseHeader', require("./decorators/Response_Header.js"));
        this.AddResponseDecorator('Res_BSG', require("./decorators/Response_BSG.js"));
        this.AddResponseDecorator('Res_Compress', require("./decorators/Response_Compress.js"));
    }
    async SetWebSocketServer(){
        this.Server.ready(err => {
            if(err) throw err;

            this.Server.ws.on("connection", socket => {
                socket.on("message", msg => console.log(msg));
                socket.on("close", () => console.log("Closed Connection"));
            })
        });
    }
    async AddRoute(path, func, type = "get"){
        switch(type){
            case "get": 
                this.Server.get(path, func);
                return;
            case "post": 
                this.Server.post(path, func);
                return;
            case "get&post":
                this.Server.get(path, func);
                this.Server.post(path, func);
                return;
            default: 
                console.log(`Route is not defined: for ${path} as ${type}`);
                return;
        }
    }
    async StartServer(){
        try
        {
            await this.Server.listen(443);
        } catch(error)
        {
            console.log(error);
        }
    }
}

module.exports = new FastifyServer();