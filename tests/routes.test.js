'use strict'
const t = require('tap');

const fastify = require("../server/fastify.js");
const database = require("../server/database.js");
const language = require('../server/modules/language.js');

 t.beforeEach(() => {
   global.JET = { executionPath: __dirname, userList: [], UserDataList: [], utils: {}, database: {}};
   database.loadDatabase();
   global.JET.database = database;
   fastify.startServer();
 }) 

t.test('test "/" routes', async t => {
  
  let response = await server.inject({
    method: 'GET',
    url: '/'
  });

  
  t.equal(response.statusCode, 200, '"/" route returns a status code of 200');
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
