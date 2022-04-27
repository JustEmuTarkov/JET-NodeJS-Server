"use strict";
const http = require('http'); // requires npm install http on the Server
const WebSocket = require('ws'); // requires npm install ws on the Server
const decompress = require('../server/decorators/Request_Decompress.js');
const compress = require('../server/decorators/Response_Compress.js');
const serverConfig = require('../server/database/database.js').core.serverConfig;

class Server {
    constructor() {
        this.name = serverConfig.name;
        this.ip = serverConfig.ip;
        this.port = serverConfig.port;
        this.backendUrl = "https://" + this.ip + ":" + this.port;
        this.second_backendUrl = "https://" + serverConfig.ip_backend + ":" + this.port;
        this.buffers = {}; // THIS SEEMS TO FIX THAT FIRST ERROR (Server.putInBuffer)
        //this.initializeCallbacks();
    }

    static webSockets = {};
    static mimeTypes = {
        "css": "text/css",
        "bin": "application/octet-stream",
        "html": "text/html",
        "jpg": "image/jpeg",
        "js": "text/javascript",
        "json": "application/json",
        "png": "image/png",
        "svg": "image/svg+xml",
        "txt": "text/plain",
    };

    static getUrl() {
        return `${serverConfig.ip}:${serverConfig.port}`;
    }

    static getHttpsUrl = () => `https://${serverConfig.ip}:${serverConfig.port}`;


    static getWebsocketUrl = () => `ws://${Server.getUrl()}`;

    static sendMessage(sessionID, output) {
        try {
            if (Server.isConnectionWebSocket(sessionID)) {
                Server.webSockets[sessionID].send(JSON.stringify(output));
                Logger.debug("WS: message sent");
            }
            else {
                Logger.debug(`WS: Socket not ready for ${sessionID}, message not sent`);
            }
        }
        catch (err) {
            Logger.error(`WS: sendMessage failed, with error: ${err}`);
        }
    }

    static isConnectionWebSocket(sessionID) {
        return Server.webSockets[sessionID] !== undefined && Server.webSockets[sessionID].readyState === WebSocket.OPEN;
    }


    initializeCallbacks() {

        this.receiveCallback = Callbacks.getReceiveCallbacks();
        this.respondCallback = Callbacks.getRespondCallbacks();

        logger.logSuccess("Create: Receive Callback");
    }


    resetBuffer = (sessionID) => { this.buffers[sessionID] = undefined; }
    getFromBuffer = (sessionID) => (this.buffers[sessionID]) ? this.buffers[sessionID].buffer : "";
    getName = () => this.name;
    getIp = () => this.ip;
    getPort = () => this.port;
    getBackendUrl = () => this.second_backendUrl != null ? this.second_backendUrl : this.backendUrl;
    getVersion = () => global.core.constants.ServerVersion;


    putInBuffer(sessionID, data, bufLength) {
        if (this.buffers[sessionID] === undefined || this.buffers[sessionID].allocated !== bufLength) {
            this.buffers[sessionID] = {
                written: 0,
                allocated: bufLength,
                buffer: Buffer.alloc(bufLength),
            };
        }

        let buf = this.buffers[sessionID];

        data.copy(buf.buffer, buf.written, 0);
        buf.written += data.length;
        return buf.written === buf.allocated;
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

    handleAsyncRequest(request, reply) {
        return new Promise(resolve => {
            resolve(this.handleRequest(request, reply));
        });
    }

    // Logs the requests made by users. Also stripped from bullshit requests not important ones.
    requestLog(request, sessionID) {
        let IP = request.connection.remoteAddress.replace("::ffff:", "");
        IP = IP == "127.0.0.1" ? "LOCAL" : IP;


        let displaySessID = typeof sessionID != "undefined" ? `[${sessionID}]` : "";

        if (
            request.url.substr(0, 6) != "/files" &&
            request.url.substr(0, 6) != "/notif" &&
            request.url != "/client/game/keepalive" &&
            request.url != "/player/health/sync" &&
            !request.url.includes(".css") &&
            !request.url.includes(".otf") &&
            !request.url.includes(".ico") &&
            !request.url.includes("singleplayer/settings/bot/difficulty")
        )
            logger.logRequest(request.url, `${displaySessID}[${IP}] `);
    }

    handleRequest(request, reply) {
        const sessionID = (consoleResponse.getDebugEnabled()) ? consoleResponse.getSession() : utility.getCookies(request)["PHPSESSID"];

        this.requestLog(request, sessionID);

        switch (request.method) {
            case "GET":
                {
                    let body = [];
                    request.on('data', (chunk) => {
                        body.push(chunk);
                    }).on('end', () => {
                        // body = Buffer.concat(body).toString();
                        let data = Buffer.concat(body);
                        console.log(data.toString());
                    });
                    server.sendResponse(sessionID, request, reply, body);
                    return true;
                }
            //case "GET":
            //case "PUT":
            case "POST":
                {
                    let body = [];
                    request.on('data', (chunk) => {
                        body.push(chunk);
                    }).on('end', () => {
                        // body = Buffer.concat(body).toString();
                        let data = Buffer.concat(body);
                        // at this point, `body` has the entire request body stored in it as a string
                        // });

                        // req.on("data", function (data) {
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

    CreateServer() {
        let backend = this.backendUrl;
        /* create server */
        const certificate = require("./certificategenerator.js");

        let httpsServer = internal.https.createServer(certificate.generate());
        httpsServer.on('request', async (req, res) => {
            this.handleAsyncRequest(req, res);
        });

        /* server is already running or program using privileged port without root */
        httpsServer.on("error", function (e) {
            if (internal.process.platform === "linux" && !(internal.process.getuid && internal.process.getuid() === 0) && e.port < 1024) {
                logger.throwErr("» Non-root processes cannot bind to ports below 1024.", ">> core/server.server.js line 274");
            } else if (e.code == "EADDRINUSE") {
                internal.psList().then((data) => {
                    let cntProc = 0;
                    for (let proc of data) {
                        let procName = proc.name.toLowerCase();
                        if (
                            (procName.indexOf("node") != -1 || procName.indexOf("server") != -1 || procName.indexOf("emu") != -1 || procName.indexOf("justemu") != -1) &&
                            proc.pid != internal.process.pid
                        ) {
                            logger.logWarning(`ProcessID: ${proc.pid} - Name: ${proc.name}`);
                            cntProc++;
                        }
                    }
                    if (cntProc > 0) logger.logError("Please close this process'es before starting this server.");
                });
                logger.throwErr(`» Port ${e.port} is already in use`, "");
            } else {
                throw e;
            }
        });

        this.port = this.normalizePort(process.env.PORT || this.port);
        this.ip = process.env.IP || this.ip;
        if (this.ip !== undefined && this.port !== undefined) {
            // httpsServer.listen(this.port, this.ip, function () {
            httpsServer.listen(this.port, this.ip, function () {
                logger.logSuccess(`Server is working at: ${backend}`);
            });
        }
        else {
            httpsServer.listen(this.port);
        }

        // Setting up websocket
        const webSocketServer = new WebSocket.Server({
            "server": httpsServer
        });

        webSocketServer.addListener("listening", () => {
            logger.logSuccess(`WebSocket is working at ${Server.getWebsocketUrl()}`);
        });

        webSocketServer.addListener("connection", Server.wsOnConnection.bind(this));


    }

    static websocketPingHandler = null;

    static defaultNotification = {
        "type": 'ping',
        "eventId": "ping"
    };

    static wsOnConnection(ws, request) {
        // Strip request and break it into sections
        const splitUrl = request.url.replace(/\?.*$/, "").split("/");
        const sessionID = splitUrl.pop();

        Logger.info(`[WS] Player: ${sessionID} has connected`);

        ws.on("message", function message(msg) {
            // doesn't reach here
            Logger.info(`Received message ${msg} from user ${sessionID}`);
        });

        Server.webSockets[sessionID] = ws;

        if (Server.websocketPingHandler) {
            clearInterval(Server.websocketPingHandler);
        }

        Server.websocketPingHandler = setInterval(() => {
            Logger.debug(`[WS] Pinging player: ${sessionID}`);

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(Server.defaultNotification));
            }
            else {
                Logger.debug("[WS] Socket lost, deleting handle");
                clearInterval(Server.websocketPingHandler);
                delete Server.webSockets[sessionID];
            }
        }, 90000);
    }

    normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    /*     softRestart() {
            logger.logInfo("[SoftRestart]: Reloading Database");
            global.mods_f.ResModLoad();
            const databasePath = "/src/functions/database.js";
            require(process.cwd() + databasePath).load();
            // will not be required if all data is loaded into memory
            logger.logInfo("[SoftRestart]: Re-initializing");
            account_f.handler.initialize();
            savehandler_f.initialize();
            locale_f.handler.initialize();
            preset_f.handler.initialize();
            weather_f.handler.initialize();
            logger.logInfo("[SoftRestart]: Reloading TamperMods");
            global.mods_f.TamperModLoad(); // TamperModLoad
            bundles_f.handler.initialize();
        }
    
        start() {
            logger.logDebug("Loading Database...");
            const databasePath = "/src/functions/database.js";
            const executedDir = internal.process.cwd();
            logger.logDebug(executedDir);
            require(process.cwd() + databasePath).load();
    
            // will not be required if all data is loaded into memory
            logger.logDebug("Initialize account...")
            account_f.handler.initialize();
            logger.logDebug("Initialize save handler...")
            savehandler_f.initialize();
            logger.logDebug("Initialize locale...")
            locale_f.handler.initialize();
            logger.logDebug("Initialize preset...")
            preset_f.handler.initialize();
    
            logger.logDebug("Load Tamper Mods...")
            global.mods_f.TamperModLoad(); // TamperModLoad
            logger.logDebug("Initialize bundles...")
            bundles_f.handler.initialize();
            logger.logInfo("Starting server...");
            this.CreateServer(); 
        }*/
}

class ServerUtils {
    zlibJson(reply, output, sessionID) {
        let Header = { "Content-Type": this.mime["json"], "Set-Cookie": "PHPSESSID=" + sessionID };
        // this should enable content encoding if you ask server from web browser
        if (typeof sessionID == "undefined") {
            Header["content-encoding"] = "deflate";
        }
        reply.writeHead(200, "OK", Header);
        compress(output, function (err, buf) {
            reply.end(buf);
        });
    }

    sendFile(reply, file) {
        let pathSlic = file.split("/");
        let type = Server.mimeTypes[pathSlic[pathSlic.length - 1].split(".")[1]] || Server.mimeTypes["txt"];
        let fileStream = fs.createReadStream(file);

        fileStream.on("open", function () {
            reply.setHeader("Content-Type", type);
            fileStream.pipe(reply);
        });
    }
}

class Callbacks {
    getReceiveCallbacks() {
        return {
            "insurance": this.receiveInsurance,
            "SAVE": this.receiveSave
        };
    }
    getRespondCallbacks() {
        return {
            "BUNDLE": this.respondBundle,
            "IMAGE": this.respondImage,
            "NOTIFY": this.respondNotify,
            "DONE": this.respondKillResponse
        };
    }
    
    receiveInsurance(sessionID, request, reply, body, output) {
        if (request.url === "/client/notifier/channel/create") {
            insurance_f.handler.checkExpiredInsurance();
        }
    }
    receiveSave(sessionID, request, reply, body, output) {
        if (global._database.clusterConfig.saveOnReceive) {
            savehandler_f.saveOpenSessions();
        }
    }

    respondBundle(sessionID, request, reply, body) {
        let bundleKey = request.url.split('/bundle/')[1];
        bundleKey = decodeURI(bundleKey);
        logger.logInfo(`[BUNDLE]: ${request.url}`);
        let bundle = bundles_f.handler.getBundleByKey(bundleKey, true);
        let path = bundle.path;
        // send bundle
        server.tarkovSend.file(reply, path);
    }
    respondImage(sessionID, request, reply, body) {
        let splittedUrl = request.url.split('/');
        let fileName = splittedUrl[splittedUrl.length - 1].split('.').slice(0, -1).join('.');
        let baseNode = {};
        let imgCategory = "none";

        // get images to look through
        switch (true) {
            case request.url.includes("/quest"):
                logger.logInfo(`[IMG.quests]: ${request.url}`);
                baseNode = res.quest;
                imgCategory = "quest";
                break;

            case request.url.includes("/handbook"):
                logger.logInfo(`[IMG.handbook]: ${request.url}`);
                baseNode = res.handbook;
                imgCategory = "handbook";
                break;

            case request.url.includes("/avatar"):
                logger.logInfo(`[IMG.avatar]: ${request.url}`);
                baseNode = res.trader;
                imgCategory = "avatar";
                break;

            case request.url.includes("/banners"):
                logger.logInfo(`[IMG.banners]: ${request.url}`);
                baseNode = res.banners;
                imgCategory = "banner";
                break;

            default:
                logger.logInfo(`[IMG.hideout]: ${request.url}`);
                baseNode = res.hideout;
                imgCategory = "hideout";
                break;
        }

        // if file does not exist
        if (!baseNode[fileName]) {
            logger.logError("Image not found! Sending backup image.");
            baseNode[fileName] = "res/noimage/" + imgCategory + ".png";
            server.tarkovSend.file(reply, baseNode[fileName]);
        } else {
            // send image
            server.tarkovSend.file(reply, baseNode[fileName]);
        }
    }
    respondNotify(sessionID, request, reply, data) {
        let splittedUrl = request.url.split('/');
        sessionID = splittedUrl[splittedUrl.length - 1].split("?last_id")[0];
        notifier_f.handler.notificationWaitAsync(reply, sessionID);
    }
    respondKillResponse() {
        return;
    }
}
module.exports = Server;