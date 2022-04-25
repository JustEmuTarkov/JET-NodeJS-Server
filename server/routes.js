const accountutil = require("../core/userdata/account.js").Accountutil;
const language = require("./modules/language.js");
const database = require("../server/database.js");

class Routes {

    /**
     * Add all needed routes to fastify server
     * @param {fastify} fastify - fastify server
     */
    static initializeRoutes(fastify) {
        
        fastify.get("/mode/offline", async function (request, reply) {
            reply.send(reply.resNoBody(database.core.serverConfig.Patches));
        });

        fastify.get("/mode/offlineNodes", async function (request, reply) {
            reply.send(reply.resNoBody(database.core.serverConfig.PatchNodes));
        });

        fastify.get("/client/languages", async function (request, reply) {
            const data = await language.getLanguages();
            reply.send(JSON.stringify(reply.resBSG(data)));
        });

        fastify.get("/", async function (request, reply) {
            reply.send({hello: 'world'});
          });
    }

    /**
     * Mao test route
     * @param {fastify} fastify 
     */
    static maoTestRoute(fastify) {
        fastify.AddRoute("/", function(req, reply) { 
            const body = req.Req_Body2Json(req);
            console.log("body: " + body);
            console.log(req.jsonBody);
            reply.responseHeader(reply, 12345);
            reply.send(reply.resCompress(reply.resBSG({ "response": "OK" })));
        }, "get&post");
    }
}

function testHandler(req, reply) {
    reply.send({France: "baise ouai"});
}

function testHandlerBSG(req, reply) {
    reply.send(reply.Res_BSG({France: "baise ouai"}));
}

function testHandlerBSGCompress(req, reply) {
    reply.send(reply.Res_Compress(JSON.stringify(reply.Res_BSG({France: "baise ouai"}))));
}


module.exports = Routes;