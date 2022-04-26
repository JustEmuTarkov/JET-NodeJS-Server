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
        t.equal(account.clientHasProfile(mockSessionID), true, 'Client has profile');
    });
})