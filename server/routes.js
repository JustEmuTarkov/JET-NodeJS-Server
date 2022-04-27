const language = require("./modules/language.js");
const database = require("../server/database.js");
const account = require("./modules/account.js");
const zlib = require('zlib');
const dialogue = require("./modules/dialogue.js");


class Routes {
    /**
     * Add all needed routes to fastify server
     * @param {fastify} fastify - fastify server
     */
    static initializeRoutes(fastify) {

        /**
         * /launcher/profile/
         */
        const launchPath = "";

        fastify.get("/launcher/profile/login", async function (request, reply) {
            let output = await account.reloadAccountByLogin(info);
            reply.send(output === "" ? "FAILED" : output);
        });
        
        fastify.get("/launcher/server/connect", async function (request, reply) {
            const data = await account.getEditions();
            const serverConfig = database.core.serverConfig;
            
            //reply.header('Content-Type', 'text/plain text');
            const finalData = {
                backendUrl: "https://" + serverConfig.ip + ":" + serverConfig.port,
                name: serverConfig.name,
                editions: data,
            }
            reply.compress(JSON.stringify(finalData))
        });

        fastify.get("/launcher/profile/register", async function (request, reply) {
            let output = await account.reloadAccountByLogin(info);
            reply.send(output !== "" ? "FAILED" : "OK");
        });

        fastify.get("/launcher/profile/get", async function (request, reply) {
            const accountID = await account.reloadAccountByLogin(info)
            let output = await account.find(accountID);
            output['server'] = server.name
            reply.send(JSON.stringify(output));
        });
        
        fastify.get("/launcher/profile/remove", async function (request, reply) {
            let output = await account.remove(info);
            reply.send(output === "" ? "FAILED" : "OK");
        });

        /**
         * /launcher/profile/change
         */
        const changePath = "/launcher/profile/change/";

        fastify.get(changePath + "email", async function (request, reply) {
            let output = await account.changeEmail(info);
            reply.send(output === "" ? "FAILED" : "OK");
        });

        fastify.get(changePath + "password", async function (request, reply) {
            let output = await account.changePassword(info);
            reply.send(output === "" ? "FAILED" : "OK");
        });

        fastify.get(changePath + "wipe", async function (request, reply) {
            let output = await account.wipe(info);
            reply.send(output === "" ? "FAILED" : "OK");
        });




        fastify.get("/mode/offline", async function (request, reply) {
            reply.send(reply.resNoBody(database.core.serverConfig.Patches));
        });

        fastify.get("/mode/offlineNodes", async function (request, reply) {
            reply.send(reply.resNoBody(database.core.serverConfig.PatchNodes));
        });


        /**
         * /client/game/
         */
        const gamePath = "/client/game/";

        fastify.get(gamePath + "start", async function (request, reply) {
            const mockAccountId = "AID0194876887698uxRXETLq";
            const data = account.clientHasAccount(mockAccountId)
            if (data) {
                reply.send(reply.resBSG({ utc_time: Date.now() / 1000 }, 0, null));
            }
            else { reply.send(reply.resBSG({ utc_time: Date.now() / 1000 }, 999, "Profile not found")); }
        });

        /**
         * /client/game/profile
         */
        const profilePath = gamePath + "profile/";



        fastify.get("/client/languages", async function (request, reply) {
            const data = await language.getLanguages();
            reply.send(JSON.stringify(reply.resBSG(data)));
        });


        /**
         * /client/mail/dialog/
         */
        const mailPath = "/client/mail/dialog/";

        fastify.get(mailPath + `getAllAttachments`, async function (request, reply) {
            const data = await dialogue.getAllAttachments(info.dialogId, sessionID);
            reply.send(reply.resBSG(data));
        });

        fastify.get(mailPath + `info`, async function (request, reply) {
            const data = await dialogue.getDialogueInfo(info.dialogId, sessionID);
            reply.send(reply.resBSG(data));
        });

        fastify.get(mailPath + `list`, async function (request, reply) {
            const data = await dialogue.generateDialogueList(sessionID);
            reply.send(data);
        });
        
        fastify.get(mailPath + `pin`, async function (request, reply) {
            //const data = await dialogue.setDialoguePin(info.dialogId, true, sessionID);
            reply.send(reply.resBSG([]));
        });

        fastify.get(mailPath + `read`, async function (request, reply) {
            //const data = await dialogue.setRead(info.dialogId, sessionID);
            reply.send(reply.resBSG([]));
        });

        fastify.get(mailPath + `remove`, async function (request, reply) {
            //const data = await dialogue.removeDialogue(info.dialogId, sessionID);
            reply.send(reply.resBSG([]));
        });

        fastify.get(mailPath + `unpin`, async function (request, reply) {
            //const data = await dialogue.setDialoguePin(info.dialogId, sessionID);
            reply.send(reply.resBSG([]));
        });

        fastify.get(mailPath + `view`, async function (request, reply) {
            const data = await dialogue.generateDialogueView(info.dialogId, sessionID);
            reply.send(data);
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