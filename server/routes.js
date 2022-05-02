const language = require("./modules/language.js");
const database = require("../server/database.js");
const account = require("./modules/account.js");
const dialogue = require("./modules/dialogue.js");
const { fileExist } = require("../core/utils/fileIO.js");

const hooks = require("./stripclub.js");


class Routes {
    /**
     * Add all needed routes to fastify server
     * @param {fastify} fastify - fastify server
     */
    static initializeRoutes(fastify) {

        hooks.cocaineAndBitches(fastify);

        fastify.get("/launcher/server/connect", (request, reply) => {
            const data = account.getEditions();
            const serverConfig = database.core.serverConfig;

            //reply.header('Content-Type', 'text/plain text');
            const finalData = {
                backendUrl: "https://" + serverConfig.ip + ":" + serverConfig.port,
                name: serverConfig.name,
                editions: data,
            }

            reply.type('application/json').compress(finalData);
        });

        fastify.post("/launcher/profile/login", async function (request, reply) {
            let output = account.reloadAccountByLogin(request.body);
            reply.type('text/plain').send(output === "" ? "FAILED" : output);
        });

        fastify.post("/launcher/profile/register", async function (request, reply) {
            let output = account.register(request.body);
            reply.type('text/plain').send(output !== "" ? "FAILED" : "OK");
        });

        fastify.post("/launcher/profile/get", async function (request, reply) {
            const serverConfig = database.core.serverConfig;
            const accountID = account.reloadAccountByLogin(request.body)
            let output = account.find(accountID);
            output['server'] = serverConfig.name
            reply.send(JSON.stringify(output));
        });

        fastify.get("/launcher/profile/remove", async function (request, reply) {
            let output = await account.remove(info);
            reply.send(output === "" ? "FAILED" : "OK");
        });

        fastify.get("/launcher/profile/change/email", async function (request, reply) {
            let output = await account.changeEmail(info);
            reply.send(output === "" ? "FAILED" : "OK");
        });

        fastify.get("/launcher/profile/change/password", async function (request, reply) {
            let output = await account.changePassword(info);
            reply.send(output === "" ? "FAILED" : "OK");
        });

        fastify.get("/launcher/profile/change/wipe", async function (request, reply) {
            let output = await account.wipe(info);
            reply.send(output === "" ? "FAILED" : "OK");
        });

        fastify.get("/mode/offline", async function (request, reply) {
            reply.send(reply.resNoBody(database.core.serverConfig.Patches));
        });

        fastify.get("/mode/offlineNodes", async function (request, reply) {
            reply.send(reply.resNoBody(database.core.serverConfig.PatchNodes));
        });

        fastify.all("/client/game/start", async function (request, reply) {
            console.log(request)
            if (account.clientHasAccount(request.body)) {
                reply.type('application/json').compress(reply.resBSG({ utc_time: Date.now() / 1000 }, 0, null, true))
            }
            reply.type('application/json').compress(reply.resBSG({ utc_time: Date.now() / 1000 }, 999, "Profile not found", true))
        });

        fastify.get("/client/menu/locale", async function (request, reply) {
            const mockAccountId = "AID0194876887698uxRXETLq";
            const data = await account.getAccountLang(mockAccountId);
            reply.send(JSON.stringify(reply.resBSG(data)));
        });

        fastify.get("/client/game/profile/list", async function (request, reply) {
            const mockAccountId = "AID0194876887698uxRXETLq";
            const data = await account.clientHasAccount(mockAccountId);
            reply.send(JSON.stringify(reply.resBSG(data)));
        });

        fastify.get("/client/languages", async function (request, reply) {
            const data = await language.getLanguages();
            reply.send(JSON.stringify(reply.resBSG(data)));
        });


        fastify.get(`/client/mail/dialog/getAllAttachments`, async function (request, reply) {
            const data = await dialogue.getAllAttachments(info.dialogId, sessionID);
            reply.send(reply.resBSG(data));
        });

        fastify.get(`/client/mail/dialog/info`, async function (request, reply) {
            const data = await dialogue.getDialogueInfo(info.dialogId, sessionID);
            reply.send(reply.resBSG(data));
        });

        fastify.get(`/client/mail/dialog/list`, async function (request, reply) {
            const data = await dialogue.generateDialogueList(sessionID);
            reply.send(data);
        });

        fastify.get(`/client/mail/dialog/pin`, async function (request, reply) {
            //const data = await dialogue.setDialoguePin(info.dialogId, true, sessionID);
            reply.send(reply.resBSG([]));
        });

        fastify.get(`/client/mail/dialog/read`, async function (request, reply) {
            //const data = await dialogue.setRead(info.dialogId, sessionID);
            reply.send(reply.resBSG([]));
        });

        fastify.get(`/client/mail/dialog/remove`, async function (request, reply) {
            //const data = await dialogue.removeDialogue(info.dialogId, sessionID);
            reply.send(reply.resBSG([]));
        });

        fastify.get(`/client/mail/dialog/unpin`, async function (request, reply) {
            //const data = await dialogue.setDialoguePin(info.dialogId, sessionID);
            reply.send(reply.resBSG([]));
        });

        fastify.get(`/client/mail/dialog/view`, async function (request, reply) {
            const data = await dialogue.generateDialogueView(info.dialogId, sessionID);
            reply.send(data);
        });
    }
}

module.exports = Routes;