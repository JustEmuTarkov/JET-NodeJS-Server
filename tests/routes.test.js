'use strict'

const t = require('tap');
const fastify = require("../server/fastify.js");
const database = require("../server/database.js");

t.test('routes', async (t) => {
  global.JET = { executionPath: __dirname, userList: [], userDataList: [], util: {}, database: {}}
  t.beforeEach(async () => {
    database.loadDatabase();
    global.JET.database = database;
  })

  t.test('test "/" routes', async t => {
    const response = await fastify.server.inject({
      method: 'GET',
      url: '/'
    });
  
    t.equal(response.statusCode, 200, 'returns a status code of 200');
  })

  t.test('test "/launcher/server/connect" routes', async t => {
    const response = await fastify.server.inject({
      method: 'GET',
      url: '/launcher/server/connect'
    });
    t.equal(response.body, '{"backendUrl":"127.0.0.1:443","name":"JustEmuTarkov","editions":["Developer","Edge Of Darkness","Left Behind","Prepare To Escape","Standard"]}', 'returns server connect infos')
  })

  t.test('test "/mode/offline" routes', async t => {
    const response = await fastify.server.inject({
      method: 'GET',
      url: '/mode/offline'
    });
    
    t.equal(response.statusCode, 200, '"/mode/offline" route returns a status code of 200');
  })

  t.test('test "/mode/offlineNodes" routes', async t => {
    const response = await fastify.server.inject({
      method: 'GET',
      url: '/mode/offlineNodes'
    });
    
    t.equal(response.statusCode, 200, '"/mode/offlineNodes" route returns a status code of 200');
  })

  t.test('test "/client/game/start" routes', async t => {
    const response = await fastify.server.inject({
      method: 'GET',
      url: '/client/game/start'
    });
    
    t.equal(response.body, '"/client/game/start" route returns time');
  })

  t.test('test "/client/languages" routes', async t => {
    //await language.initialize(database.locales);
    const response = await fastify.server.inject({
      method: 'GET',
      url: '/client/languages'
    });
    
    t.equal(response.statusCode, 200, '"/client/languages" route returns a status code of 200');
  })

}) 