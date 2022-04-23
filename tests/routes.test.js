'use strict'
const t = require('tap');

const fastify = require("../server/fastify.js");
const database = require("../server/database.js");
const language = require('../server/modules/language.js');

//t.beforeEach(() => {
//  
//}) 

t.test('test "/" routes', async t => {
  global.JET = { ExecutionPath: __dirname, UserList: [], UserDataList: [], Utils: {}, Database: {}};
  database.loadDatabase();
  global.JET.Database = database;

  const response = await fastify.server.inject({
    method: 'GET',
    url: '/'
  });

  t.equal(response.statusCode, 200, 'returns a status code of 200');
})

t.test('test "/client/languages" routes', async t => {
  global.JET = { ExecutionPath: __dirname, UserList: [], UserDataList: [], Utils: {}, Database: {}};
  database.loadDatabase();
  global.JET.Database = database;

  await language.initialize(database.languages);
  const response = await fastify.server.inject({
    method: 'GET',
    url: '/client/languages'
  });
  
  t.equal(response.statusCode, 200, '"/client/languages" route returns a status code of 200');
})
