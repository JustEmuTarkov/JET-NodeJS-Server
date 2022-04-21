'use strict'

const fastify = require("./Server/Fastify.js");
const database = require("./Server/database.js");

global.JET = { ExecutionPath: __dirname, UserList: [], UserDataList: [], Utils: {} }
global.JET.Utils = require('./Core/Utils');

console.log(JET.Utils);

database.loadDatabase();
global.JET.Database = database;


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