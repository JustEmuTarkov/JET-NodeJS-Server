'use strict'

const fs = require("fs");
const path = require("path");

global.JET = { ExecutionPath: __dirname, UserList: [], UserDataList: [] }
const Fastify = require("./Server/Fastify.js");
const Routes = new (require("./Server/Routes.js"))(Fastify);
const Database = require("./Server/Database.js");
global.JET.Database = Database;


const LoadServerProfileList = () => {
    const Profiles = fs.readdirSync(global.JET.ExecutionPath + "/User/Profiles");
    for(let profileId of Profiles){
        if(profileId.includes(".")) continue;
        global.JET.UserList.push(profileId);
    }
}


//Fastify.Server.decorate("jet_db", Database);

LoadServerProfileList();
Fastify.StartServer();