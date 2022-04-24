const t = require('tap');
const database = require('../../server/database.js');
const profile = require('../../server/modules/profile.js');


t.test('Module-Profile', async (t) => {
    global.JET = { executionPath: __dirname, userList: [], userDataList: [], utils: {}, database: {}}
    t.beforeEach(async () => {
      database.loadDatabase();
      global.JET.database = database;
    })

    t.test('Get editions', async t => {
        const editions = await profile.getEditions();
        t.equal(Array.isArray(editions), true, 'returns a list of editions');
    })

    t.end();
})
