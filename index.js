'use strict'
const language = require("./server/modules/language.js");
const fastify = require("./server/fastify.js");
const database = require("./server/database.js");
const account = require("./server/modules/account.js");

global.JET = { executionPath: __dirname, userList: [], userdataList: [], util: {} }
global.JET.util = require('./core/util.js');

console.log(JET.util);

database.loadDatabase();
global.JET.database = database;

language.initialize(database.locales);

const serverAccounts = new account.Account();

const fastifyServer = new fastify.FastifyServer(serverAccounts);

//const LoadServerProfileList = () => {
//    const Profiles = fs.readdirSync(global.JET.executionPath + "/User/Profiles");
//    for(let profileId of Profiles){
//        if(profileId.includes(".")) continue;
//        global.JET.userList.push(profileId);
//    }
//}


// //Fastify.Server.decorate("jet_db", database);

// LoadServerProfileList();
fastifyServer.startServer();