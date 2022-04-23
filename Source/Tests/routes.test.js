'use strict'
const t = require('tap');
const fastify = require("../Server/Fastify.js");
const database = require("../Server/Database.js");
const language = require('../Server/modules/language.js');

t.test('...', async (t) => {
  global.JET = { ExecutionPath: __dirname, UserList: [], UserDataList: [], Utils: {}, Database: {}}
  let server;
  t.before(async () => {
    database.loadDatabase();
    global.JET.Database = database;
    fastify.StartServer();
    server = fastify.Server;
  })

  t.test('requests the "/" route', async t => {
    const response = await server.inject({
      method: 'GET',
      url: '/'
    });
  
    t.equal(response.statusCode, 200, '"/" route returns a status code of 200');
  })

  t.test('Requests "/client/languages" route', async t => {
    await language.initialize(database.languages);
    const response = await server.inject({
      method: 'GET',
      url: '/client/languages'
    });
  
    t.equal(response.statusCode, 200, '"/client/languages" route returns a status code of 200');
  })
})



