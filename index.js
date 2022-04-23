'use strict'
const language = require("./server/modules/language.js");
const fastify = require("./server/fastify.js");
const database = require("./server/database.js");

global.JET = { ExecutionPath: __dirname, UserList: [], userdataList: [], Utils: {} }
global.JET.Utils = require('./core/utils');

console.log(JET.Utils);

database.loadDatabase();
global.JET.Database = database;

language.initialize(database.languages);

//const LoadServerProfileList = () => {
//    const Profiles = fs.readdirSync(global.JET.ExecutionPath + "/User/Profiles");
//    for(let profileId of Profiles){
//        if(profileId.includes(".")) continue;
//        global.JET.UserList.push(profileId);
//    }
//}


// //Fastify.Server.decorate("jet_db", Database);

// LoadServerProfileList();
fastify.startServer();