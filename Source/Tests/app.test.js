'use strict'

const fastify = require("../Server/Fastify.js");
const { test } = require('tap');

test('requests the "/" route', async t => {
  fastify.StartServer();
  const server = fastify.Server;

  t.teardown(() => server.close())

  const response = await server.inject({
    method: 'GET',
    url: '/'
  })

  

  t.equal(response.statusCode, 200, 'returns a status code of 200')
})