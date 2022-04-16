'use strict'

const fs = require("fs");
const path = require("path");
const fastify = require("./Server/Fastify.js");
const routes = require("./Server/Routes.js");

global.JET = { ExecutionPath: __dirname, UserList: [], UserDataList: [], Utils: {} }
global.JET.Utils = require('./Core/Utils');

console.log(JET.Utils);

routes.initializeRoutes(fastify.Server);
console.log(routes);
const database = require("./Server/Database.js");
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