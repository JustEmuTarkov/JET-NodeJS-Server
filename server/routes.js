const language = require("./modules/language.js");
const database = require("../server/database.js");
const account = require("./modules/account.js");
const dialogue = require("./modules/dialogue.js");
const { fileExist } = require("../core/utils/fileIO.js");
const zlib = require("zlib");

/**
 * we need to figure out what the fuck these do and use them accordingly
 * to be honest, I don't know what they do
 * i just know they're needed to deal with requests and responses
 */
class Router {
    constructor() {
        this.routes = Routes
    }

    receiveResponse(request, body, sessionID) {
        let output = "";
        let url = request.url;
        let info = {};
        if (typeof body != "object") {
            /* parse body */
            if (body !== "") {
                info = fileIO.parse(body);
            }
        } else {
            if (url.includes("/server/config") && !url.includes(".css")) {
                info = body;
            }
        }
        /* remove retry from URL */
        if (url.includes("?retry=")) {
            url = url.split("?retry=")[0];
        }

        /* route request */
        if (url in this.responseClass.staticResponses) {
            output = this.responseClass.staticResponses[url](url, info, sessionID);
        } else {
            for (let key in this.responseClass.dynamicResponses) {
                if (url.includes(key)) {
                    output = this.responseClass.dynamicResponses[key](url, info, sessionID);
                    break; // hit only first request that matches and disband searching
                }
            }
        }

        return output;
    }

    handleRequest(request, reply) {
        const sessionID = (consoleResponse.getDebugEnabled()) ? consoleResponse.getSession() : utility.getCookies(request)["PHPSESSID"];

        //this.requestLog(request, sessionID);

        switch (request.method) {
            case "GET":
                {
                    let body = [];
                    request.on('data', (chunk) => {
                        body.push(chunk);
                    }).on('end', () => {
                        let data = Buffer.concat(body);
                        console.log(data.toString());
                    });
                    server.sendResponse(sessionID, request, reply, body);
                    return true;
                }
            case "POST":
                {
                    let body = [];
                    request.on('data', (chunk) => {
                        body.push(chunk);
                    }).on('end', () => {
                        let data = Buffer.concat(body);

                        if (request.url == "/" || request.url.includes("/server/config")) {
                            let _Data = data.toString();
                            _Data = _Data.split("&");
                            let _newData = {};
                            for (let item in _Data) {
                                let datas = _Data[item].split("=");
                                _newData[datas[0]] = datas[1];
                            }
                            server.sendResponse(sessionID, request, reply, _newData);
                            return;
                        }
                        // console.log(data);
                        decompress(data, function (err, body) {
                            // console.log(body);
                            if (body !== undefined) {
                                let jsonData = body !== typeof "undefined" && body !== null && body !== "" ? body.toString() : "{}";
                                server.sendResponse(sessionID, request, reply, jsonData);
                            }
                            else {
                                server.sendResponse(sessionID, request, reply, "")
                            }
                        });
                    });
                    return true;
                }
            case "PUT":
                {
                    request.on("data", function (data) {
                        // receive data
                        if ("expect" in request.headers) {
                            const requestLength = parseInt(request.headers["content-length"]);

                            if (!server.putInBuffer(request.headers.sessionid, data, requestLength)) {
                                reply.writeContinue();
                            }
                        }
                    })
                        .on("end", function () {
                            let data = server.getFromBuffer(sessionID);
                            server.resetBuffer(sessionID);

                            decompress(data, function (err, body) {
                                let jsonData = body !== typeof "undefined" && body !== null && body !== "" ? body.toString() : "{}";
                                server.sendResponse(sessionID, request, reply, jsonData);
                            });
                        });
                    return true;
                }
            default:
                {
                    return true;
                }
        }
    }

    sendResponse(sessionID, request, reply, body) {
        let output = "";

        //check if page is static html page or requests like 
        if (ServerUtils.sendFile(request, reply))
            return;

        // get response
        if (request.method === "POST" || request.method === "PUT") {
            output = router.getResponse(request, body, sessionID);
        } else {
            output = router.getResponse(request, "", sessionID);
            // output = router.getResponse(req, body, sessionID);
        }

        /* route doesn't exist or response is not properly set up */
        if (output === "") {
            logger.logError(`[UNHANDLED][${request.url}]`);
            logger.logData(body);
            output = `{"err": 404, "errmsg": "UNHANDLED RESPONSE: ${request.url}", "data": null}`;
        } else {
            logger.logDebug(body, true);
        }
        // execute data received callback
        for (let type in this.receiveCallback) {
            this.receiveCallback[type](sessionID, request, reply, body, output);
        }

        // send response
        if (output in this.respondCallback) {
            this.respondCallback[output](sessionID, request, reply, body);
        } else {
            ServerUtils.zlibJson(reply, output, sessionID);
        }
    }
}

class Routes {
    /**
     * Add all needed routes to fastify server
     * @param {fastify} fastify - fastify server
     */
    static initializeRoutes(fastify) {

        fastify.addHook('onRequest', (request, reply, done) => {
            if (request.method == "GET") {
                let body = [];
                request.req.on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
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
                    console.log(body);
                    let data = Buffer.concat(body);
                    console.log(data);
                    zlib.inflate(data, function(err, body){
                        if (body !== undefined) {
                            request.body = body !== typeof "undefined" && body !== null && body !== "" ? body.toString() : "{}";
                        }
                    })
                })
            }
            done();
        })

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
            let output = await account.reloadAccountByLogin(request.body);
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