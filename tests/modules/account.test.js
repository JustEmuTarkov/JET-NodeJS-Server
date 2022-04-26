'use strict'

const t = require('tap');
const database = require('../../server/database.js');
const account = require('../../server/modules/account.js');

t.test('Module-Account', async (t) => {
    global.JET = { executionPath: __dirname, userList: [], userDataList: [], util: {}, database: {}}
    t.beforeEach(async () => {
        database.loadDatabase();
        global.JET.database = database;
    });

    t.test('Account exists', async t => {
        const mockSessionID = 'AID0194876887698uxRXETLq'
        t.equal(account.clientHasAccount(mockSessionID), true, 'Client has profile');
    });

    t.test('Get editions', async t => {
        const editions = await account.getEditions();
        t.equal(Array.isArray(editions), true, 'returns a list of editions');
    });
})