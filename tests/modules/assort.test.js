'use strict'

const t = require('tap');
const database = require('../../server/database.js');

t.test('Module-Assort', async (t) => {
global.JET = { executionPath: __dirname, userList: [], userDataList: [], utils: {}, database: {}}
t.beforeEach(async () => {
    database.loadDatabase();
    global.JET.database = database;
    await 
})
})