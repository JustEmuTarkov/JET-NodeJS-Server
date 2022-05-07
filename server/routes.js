const language = require("./modules/language.js");
const database = require("../server/database.js");
const account = require("./modules/account.js");
const dialogue = require("./modules/dialogue.js");
const { fileExist } = require("../core/utils/fileIO.js");
const hooks = require("./stripclub.js");
const { getSessionID } = require("./decorators/decorators.js");

class Routes {
    /**
     * Add all needed routes to fastify server
     * @param {fastify} fastify - fastify server
     */
    static initializeRoutes(fastify) {

        hooks.cocaineAndBitches(fastify);

        fastify.all("/launcher/server/connect", (request, reply) => {
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

        fastify.all("/launcher/profile/login", async function (request, reply) {
            let output = account.reloadAccountByLogin(request.body);
            reply.setCookie("PHPSESSID", output)

            reply.type('text/plain').send(output === "" ? "FAILED" : output);
        });

        fastify.all("/launcher/profile/register", async function (request, reply) {
            let output = account.register(request.body);
            reply.type('text/plain').send(output !== "" ? "FAILED" : "OK");
        });

        fastify.all("/launcher/profile/get", async function (request, reply) {
            const serverConfig = database.core.serverConfig;
            const accountID = account.reloadAccountByLogin(request.body)
            let output = account.find(accountID);
            output['server'] = serverConfig.name
            reply.send(JSON.stringify(output));
        });

        fastify.all("/launcher/profile/remove", async function (request, reply) {
            let output = await account.remove(info);
            reply.send(output === "" ? "FAILED" : "OK");
        });

        fastify.all("/launcher/profile/change/email", async function (request, reply) {
            let output = await account.changeEmail(info);
            reply.send(output === "" ? "FAILED" : "OK");
        });

        fastify.all("/launcher/profile/change/password", async function (request, reply) {
            let output = await account.changePassword(info);
            reply.send(output === "" ? "FAILED" : "OK");
        });

        fastify.all("/launcher/profile/change/wipe", async function (request, reply) {
            let output = await account.wipe(info);
            reply.send(output === "" ? "FAILED" : "OK");
        });

        fastify.all("/mode/offline", async function (request, reply) {
            reply.send(reply.resNoBody(database.core.serverConfig.Patches));
        });

        fastify.all("/mode/offlineNodes", async function (request, reply) {
            reply.send(reply.resNoBody(database.core.serverConfig.PatchNodes));
        });

        fastify.all("/client/game/start", async function (request, reply) {
            // you need to get phpsessid here not request body ...
            if (account.clientHasAccount(request.cookies.PHPSESSID)) {
                reply.type('application/json').compress(reply.resBSG({ utc_time: Date.now() / 1000 }, 0, null, true))
                return 
            }
            reply.type('application/json').compress(reply.resBSG({ utc_time: Date.now() / 1000 }, 999, "Profile not found", true))
        });

        fastify.all("/client/menu/locale/:lang", async function (request, reply) {
            reply.send(JSON.stringify(reply.resBSG(language.getMenu(request.params.lang, database.locales))));
        });

        fastify.all("/client/game/profile/list", async function (request, reply) {
            const data = account.clientHasAccount(request.cookies.PHPSESSID);
            reply.send(JSON.stringify(reply.resBSG(data)));
        });

        fastify.all("/client/languages", async function (request, reply) {
            const data = language.getLanguages();
            reply.send(JSON.stringify(reply.resBSG(data)));
        });


        fastify.all(`/client/mail/dialog/getAllAttachments`, async function (request, reply) {
            const data = await dialogue.getAllAttachments(info.dialogId, sessionID);
            reply.send(reply.resBSG(data));
        });

        fastify.all(`/client/mail/dialog/info`, async function (request, reply) {
            const data = await dialogue.getDialogueInfo(info.dialogId, sessionID);
            reply.send(reply.resBSG(data));
        });

        fastify.all(`/client/mail/dialog/list`, async function (request, reply) {
            const data = await dialogue.generateDialogueList(sessionID);
            reply.send(data);
        });

        fastify.all(`/client/mail/dialog/pin`, async function (request, reply) {
            //const data = await dialogue.setDialoguePin(info.dialogId, true, sessionID);
            reply.send(reply.resBSG([]));
        });

        fastify.all(`/client/mail/dialog/read`, async function (request, reply) {
            //const data = await dialogue.setRead(info.dialogId, sessionID);
            reply.send(reply.resBSG([]));
        });

        fastify.all(`/client/mail/dialog/remove`, async function (request, reply) {
            //const data = await dialogue.removeDialogue(info.dialogId, sessionID);
            reply.send(reply.resBSG([]));
        });

        fastify.all(`/client/mail/dialog/unpin`, async function (request, reply) {
            //const data = await dialogue.setDialoguePin(info.dialogId, sessionID);
            reply.send(reply.resBSG([]));
        });

        fastify.all(`/client/mail/dialog/view`, async function (request, reply) {
            const data = await dialogue.generateDialogueView(info.dialogId, sessionID);
            reply.send(data);
        });
    }
}

module.exports = Routes;