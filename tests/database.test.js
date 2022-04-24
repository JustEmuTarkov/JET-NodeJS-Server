'use strict'

const t = require('tap');
const database = require('../server/database.js');
const language = require('../server/modules/language.js');


t.test('database', async (t) => {
    global.JET = { executionPath: __dirname, userList: [], userDataList: [], utils: {}, database: {}}
    t.before(async () => {
      database.loadDatabase();
      global.JET.database = database;
    })

    t.test('Load database', async t => {
        t.equal(typeof database.core, 'object', 'core is an object');
        t.equal(typeof database.items, 'object', 'items is an object');
        t.equal(typeof database.hideout, 'object', 'hideout is an object');
        t.equal(typeof database.weather, 'object', 'weather is an object');
        t.equal(typeof database.locales, 'object', 'languages is an object');
        t.equal(typeof database.templates, 'object', 'templates is an object');
        t.equal(typeof database.bots, 'object', 'bots is an object');
        t.equal(typeof database.profiles, 'object', 'profiles is an object');
        t.equal(typeof database.traders, 'object', 'traders is an object');
        t.end();
    })

    t.end();
})
