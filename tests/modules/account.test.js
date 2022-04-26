'use strict'

const t = require('tap');
const database = require('../../server/database.js');
const account = require('../../server/modules/account.js');

t.test('Module-Account', async (t) => {
    global.JET = { executionPath: __dirname, userList: [], userDataList: [], util: {}, database: {}}
    let accountServer;
    t.beforeEach(async () => {
        database.loadDatabase();
        global.JET.database = database;
        accountServer = new account.Account();
    });

    t.test('Account exists', async t => {
        const mockSessionID = 'AID0194876887698uxRXETLq'
        t.equal(accountServer.clientHasProfile(mockSessionID), true, 'Client has profile');
    });
})