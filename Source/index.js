'use strict'
const language = require("./Server/modules/language.js");
const fastify = require("./Server/fastify.js");
const database = require("./Server/database.js");

global.JET = { ExecutionPath: __dirname, UserList: [], UserDataList: [], Utils: {} }
global.JET.Utils = require('./Core/Utils');

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
fastify.StartServer();