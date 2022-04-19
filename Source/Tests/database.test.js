'use strict'

const { test } = require('tap');
const database = require('../Server/Database.js');

test('Load database', async t => {
    await database.loadDatabase();
    t.equal(typeof database.core, 'object', 'core is an object');
    t.equal(typeof database.items, 'object', 'items is an object');
    t.equal(typeof database.hideout, 'object', 'hideout is an object');
    t.equal(typeof database.weather, 'object', 'weather is an object');
    t.equal(typeof database.languages, 'object', 'languages is an object');
    t.equal(typeof database.templates, 'object', 'templates is an object');
    t.equal(typeof database.configs, 'object', 'configs is an object');
    t.equal(typeof database.bots, 'object', 'bots is an object');
    t.equal(typeof database.profiles, 'object', 'profiles is an object');
    t.end();
})