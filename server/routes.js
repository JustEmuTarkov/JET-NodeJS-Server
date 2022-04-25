const language = require("./modules/language.js");
const database = require("../server/database.js");
const profile = require('./modules/profile.js');
const account = require("../core/userdata/account.js");

class Routes {

    /**
     * Add all needed routes to fastify server
     * @param {fastify} fastify - fastify server
     */
    static initializeRoutes(fastify) {

        fastify.get("/launcher/server/connect", async function (request, reply) {
            const data = await profile.getEditions();
            const serverConfig = database.core.serverConfig;
            reply.send(JSON.stringify({
                backendUrl: serverConfig.ip + ":" + serverConfig.port,
                name: serverConfig.name,
                editions: data,
            }))
        })

        fastify.get("/mode/offline", async function (request, reply) {
            reply.send(reply.resNoBody(database.core.serverConfig.Patches));
        });

        fastify.get("/mode/offlineNodes", async function (request, reply) {
            reply.send(reply.resNoBody(database.core.serverConfig.PatchNodes));
        });

        fastify.get("/client/game/start", async function (request, reply) {
            const sessionID = "AID0194876887698uxRXETLq";
            const data = await account.AccountUtils.clientHasProfile(sessionID)
            if (data) {
                reply.send(reply.resBSG({ utc_time: Date.now() / 1000 }, 0, null));
            }
            else { reply.send(reply.resBSG({ utc_time: Date.now() / 1000 }, 999, "Profile not found")); }
        });

        fastify.get("/client/languages", async function (request, reply) {
            const data = await language.getLanguages();
            reply.send(JSON.stringify(reply.resBSG(data)));
        });

        fastify.get("/", async function (request, reply) {
            reply.send({ hello: 'world' });
        });
    }

    /**
     * Mao test route
     * @param {fastify} fastify 
     */
    static maoTestRoute(fastify) {
        fastify.AddRoute("/", function (req, reply) {
            const body = req.Req_Body2Json(req);
            console.log("body: " + body);
            console.log(req.jsonBody);
            reply.responseHeader(reply, 12345);
            reply.send(reply.resCompress(reply.resBSG({ "response": "OK" })));
        }, "get&post");
    }
}

function testHandler(req, reply) {
    reply.send({ France: "baise ouai" });
}

function testHandlerBSG(req, reply) {
    reply.send(reply.Res_BSG({ France: "baise ouai" }));
}

function testHandlerBSGCompress(req, reply) {
    reply.send(reply.Res_Compress(JSON.stringify(reply.Res_BSG({ France: "baise ouai" }))));
}


module.exports = Routes;