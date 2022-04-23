'use strict'

const t = require('tap');
const database = require('../server/database.js');
const language = require('../server/modules/language.js');


t.test('Database', async (t) => {
    global.JET = { ExecutionPath: __dirname, UserList: [], UserDataList: [], Utils: {}, Database: {}}
    t.before(async () => {
      database.loadDatabase();
      global.JET.database = database;
    })

    t.test('Load database', async t => {
        t.equal(typeof database.core, 'object', 'core is an object');
        t.equal(typeof database.items, 'object', 'items is an object');
        t.equal(typeof database.hideout, 'object', 'hideout is an object');
        t.equal(typeof database.weather, 'object', 'weather is an object');
        t.equal(typeof database.languages, 'object', 'languages is an object');
        t.equal(typeof database.templates, 'object', 'templates is an object');
        t.equal(typeof database.bots, 'object', 'bots is an object');
        t.equal(typeof database.profiles, 'object', 'profiles is an object');
        t.end();
    })

    t.end();
})
