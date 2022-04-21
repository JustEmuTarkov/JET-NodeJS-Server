const accountUtils = require("../Core/UserData/Account.js").AccountUtils;
const language = require("./modules/language.js");

class Routes {

    /**
     * Add all needed routes to fastify server
     * @param {fastify} fastify - fastify server
     */
    static initializeRoutes(fastify) {

        //// NEW REQUESTS
        //"/client/repeatalbeQuests/activityPeriods": this.clientRepeatableQuestsActivityPeriods,
        //"/singleplayer/settings/bot/maxCap": this.dynSingleplayerSettingsBotMaxCap,
        //// CORE REQUESTS
        //"/client/account/customization": this.clientAccountCustomization,
        //"/client/chatServer/list": this.clientChatServerList,
        //"/client/checkVersion": this.clientCheckVersion,
        //"/client/customization": this.clientCustomization,
        //"/client/friend/list": this.clientFriendList,
        //"/client/friend/request/list/inbox": this.clientFriendRequestListInbox,
        //"/client/friend/request/list/outbox": this.clientFriendRequestListOutbox,
        //"/client/friend/request/send": this.clientFriendRequestSend,
        //"/client/game/bot/generate": this.clientGameBotGenerate,
        //"/client/game/config": this.clientGameConfig,
        //"/client/game/keepalive": this.clientGameKeepalive,
        //"/client/game/logout": this.clientGameLogout,
        //"/client/game/profile/create": this.clientGameProfileCreate,
        //"/client/game/profile/items/moving": this.clientGameProfileItemsMoving,
        //"/client/game/profile/list": this.clientGameProfileList,
        //"/client/game/profile/nickname/change": this.clientGameProfileNicknameChange,
        //"/client/game/profile/nickname/reserved": this.clientGameProfileNicknameReserved,
        //"/client/game/profile/nickname/validate": this.clientGameProfileNicknameValidate,
        //"/client/game/profile/savage/regenerate": this.clientGameProfileSavageRegenerate,
        //"/client/game/profile/search": this.clientGameProfileSearch,
        //"/client/game/profile/select": this.clientGameProfileSelect,
        //"/client/game/profile/voice/change": this.clientGameProfileVoiceChange,
        //"/client/game/start": this.clientGameStart,
        //"/client/game/version/validate": this.clientGameVersionValidate,
        //"/client/getMetricsConfig": this.clientGetMetricsConfig,
        //"/client/globals": this.clientGlobals,
        //"/client/handbook/builds/my/list": this.clientHandbookBuildsMyList,
        //"/client/handbook/templates": this.clientHandbookTemplates,
        //"/client/hideout/areas": this.clientHideoutAreas,
        //"/client/hideout/production/recipes": this.clientHideoutProductionRecipes,
        //"/client/hideout/production/scavcase/recipes": this.clientHideoutProductionScavcaseRecipes,
        //"/client/hideout/settings": this.clientHideoutSettings,
        //"/client/insurance/items/list/cost": this.clientInsuranceItemsListCost,
        //"/client/items": this.clientItems,
        //"/client/items/prices": this.clientItemsPrices,
        //"/client/languages": this.clientLanguages,
        //"/client/locations": this.clientLocations,
        //"/client/mail/dialog/getAllAttachments": this.clientMailDialogGetAllAttachments,
        //"/client/mail/dialog/info": this.clientMailDialogInfo,
        //"/client/mail/dialog/list": this.clientMailDialogList,
        //"/client/mail/dialog/pin": this.clientMailDialogPin,
        //"/client/mail/dialog/read": this.clientMailDialogRead,
        //"/client/mail/dialog/remove": this.clientMailDialogRemove,
        //"/client/mail/dialog/unpin": this.clientMailDialogUnpin,
        //"/client/mail/dialog/view": this.clientMailDialogView,
        //"/client/match/available": this.clientMatchAvailable,
        //"/client/match/exit": this.clientMatchExit,
        //"/client/match/group/create": this.clientMatchGroupCreate,
        //"/client/match/group/delete": this.clientMatchGroupDelete,
        //"/client/match/group/exit_from_menu": this.clientMatchGroupExit_From_Menu,
        //"/client/match/group/invite/accept": this.clientMatchGroupInviteAccept,
        //"/client/match/group/invite/cancel": this.clientMatchGroupInviteCancel,
        //"/client/match/group/invite/send": this.clientMatchGroupInviteSend,
        //"/client/match/group/looking/start": this.clientMatchGroupLookingStart,
        //"/client/match/group/looking/stop": this.clientMatchGroupLookingStop,
        //"/client/match/group/start_game": this.clientMatchGroupStart_Game,
        //"/client/match/group/status": this.clientMatchGroupStatus,
        //"/client/match/join": this.clientMatchJoin,
        //"/client/match/offline/start": this.clientMatchOfflineStart,
        //"/client/match/offline/end": this.clientMatchOfflineEnd,
        //"/client/match/updatePing": this.clientMatchUpdatePing,
        //"/client/notifier/channel/create": this.clientNotifierChannelCreate,
        //"/client/profile/status": this.clientProfileStatus,
        //"/client/putMetrics": this.clientPutMetrics,
        //"/client/quest/list": this.clientQuestList,
        //"/client/ragfair/find": this.clientRagfairFind,
        //"/client/ragfair/itemMarketPrice": this.clientRagfairItemMarketPrice,
        //"/client/ragfair/search": this.clientRagfairSearch,
        //"/client/server/list": this.clientServerList,
        //"/client/settings": this.clientSettings,
        //"/client/trading/api/getTradersList": this.clientTradingApiGetTradersList,
        //"/client/trading/api/traderSettings": this.clientTradingApiTraderSettings,
        //"/client/trading/customization/storage": this.clientTradingCustomizationStorage,
        //"/client/weather": this.clientWeather,
        //"/launcher/profile/change/email": this.launcherProfileChangeEmail,
        //"/launcher/profile/change/password": this.launcherProfileChangePassword,
        //"/launcher/profile/change/wipe": this.launcherProfileChangeWipe,
        //"/launcher/profile/get": this.launcherProfileGet,
        //"/launcher/profile/login": this.launcherProfileLogin,
        //"/launcher/profile/register": this.launcherProfileRegister,
        //"/launcher/profile/remove": this.launcherProfileRemove,
        //"/launcher/server/connect": this.launcherServerConnect,
        //"/mode/offline": this.modeOfflinePatches,
        //"/mode/offlineNodes": this.modeOfflinePatchNodes,
        //"/player/health/events": this.playerHealthEvents,
        //"/player/health/sync": this.playerHealthSync,
        //"/raid/map/name": this.raidMapName,
        //"/raid/profile/list": this.raidProfileList,
        //"/raid/profile/save": this.raidProfileSave,
        //"/server/config/accounts": this.serverConfigAccounts,
        //"/server/config/gameplay": this.serverConfigGameplay,
        //"/server/config/mods": this.serverConfigMods,
        //"/server/config/profiles": this.serverConfigProfiles,
        //"/server/config/server": this.serverConfigServer,
        //"/server/softreset": this.serverSoftReset,
        //"/singleplayer/bundles": this.singleplayerBundles,
        //"/singleplayer/settings/raid/endstate": this.singleplayerSettingsRaidEndstate,
        //"/singleplayer/settings/raid/menu": this.singleplayerSettingsRaidMenu,
        //"/singleplayer/settings/bot/difficulty": this.singleplayerSettingsBotDifficulty,
        //Routes.addRoute(fastify, "/client/languages", language.getLanguages(), ["GET", "POST"]);
        Routes.addRoute(fastify, "/", async function (request, reply) {
            return { hello: 'world' }
          }, "GET");
    }

    /**
     * Template function that can add routes to the server dynamically
     * @param {fastify} fastify - fastify server
     * @param {string} route - route to add (ex: /api/v1/user/)
     * @param {function} handler - function that will be executed when the route is called
     * @param {string} method - method that will be used to call the route (ex: GET, POST)
     */
    static addRoute(fastify, route, handler, method) {
        fastify.route({
            method: method,
            url: route,
            handler: handler
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
            reply.ResponseHeader(reply, 12345);
            reply.send(reply.Res_Compress(reply.Res_BSG({ "response": "OK" })));
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