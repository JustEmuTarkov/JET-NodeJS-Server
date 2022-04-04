
class FastifyServer {
    constructor()
    {
        const CertificateGenerator = new (require('./CertificateGenerator.js')).CertificateGenerator();

        this.Server = require('fastify')({
            logger: true,
            http2: true,
            https: {
                allowHTTP1: true, // fallback support for HTTP1
                key: CertificateGenerator.KEY,
                cert: CertificateGenerator.CERT
            }
        });
        this.Server.register(require("fastify-ws"));
        this.SetWebSocketServer();
        this.Request_Decorators();
        this.Response_Decorators();
    }

    async Request_Decorators(){
        this.Server.decorateRequest('Req_Body2Json', require("./decorators/Request_BodyToJson.js"));
        this.Server.decorateRequest('Req_Decompress', require("./decorators/Request_Decompress.js"));
    }
    async Response_Decorators(){
        this.Server.decorateReply('ResponseHeader', require("./decorators/Response_Header.js"));
        this.Server.decorateReply('Res_BSG', require("./decorators/Response_BSG.js"));
        this.Server.decorateReply('Res_Compress', require("./decorators/Response_Compress.js"));
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

    async StartServer()
    {
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