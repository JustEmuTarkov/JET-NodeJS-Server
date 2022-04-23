'use strict'
const t = require('tap');
const fastify = require("../Server/fastify.js");
const database = require("../Server/Database.js");
const language = require('../Server/modules/language.js');


 t.beforeEach(() => {
   global.JET = { ExecutionPath: __dirname, UserList: [], UserDataList: [], Utils: {}, Database: {}};
   database.loadDatabase();
   global.JET.Database = database;
   fastify.startServer();
 }) 

t.test('test "/" routes', async t => {
  
  let response = await server.inject({
    method: 'GET',
    url: '/'
  });

  
  t.equal(response.statusCode, 200, '"/" route returns a status code of 200');
  fastify.server.close();
  t.end();
})

//t.test('test "/client/languages" routes', async t => {
//  fastify.StartServer();
//  const server = fastify.Server;
//
//  await language.initialize(database.languages);
//  response = await server.inject({
//    method: 'GET',
//    url: '/client/languages'
//  });
//  server.close();
//  
//  t.equal(response.statusCode, 200, '"/client/languages" route returns a status code of 200');
//  
//  t.end();
//})
