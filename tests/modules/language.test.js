'use strict'

const t = require('tap');
const database = require('../../Server/database.js');
const language = require('../../Server/modules/language.js');


t.test('Module-Language', async (t) => {
    global.JET = { executionPath: __dirname, userList: [], UserDataList: [], utils: {}, database: {}}
    t.before(async () => {
      database.loadDatabase();
      global.JET.database = database;
    })

    t.test('Initialize language', async t => {
        await language.initialize(database.languages);

        const languageDatabase = global.JET.database.languages;
        const interfaceToVerify = [
            "Attention! This is a Beta version of Escape from Tarkov for testing purposes.",
            "NDA free warning",
            "Offline raid description",
        ];
        const valueNeeded = [
            "Attention! This is Emulated version of \"Escape from Tarkov\". Provided by JustEmuTarkov Team (justemutarkov.eu).",
            "If you like this game make sure to support official creators of this game (BattleState Games).",
            "You are now entering an emulated version of a Tarkov raid. This emulated raid has all the features of a live version, but it has no connection to BSG's servers, and stays local on your PC.\nOther PMCs will spawn as emulated AI, and will spawn with randomized gear, levels, inventory, and names. This means you can loot, kill, and extract as you would online, and keep your inventory when you extract, but you cannot bring this loot into live EFT servers.\nIf you have any questions, don't hesitate to join the JustEmuTarkov Discord for assistance.",
        ]
        for (let indexInterface in interfaceToVerify){
            t.equal(languageDatabase.en.locale.interface[interfaceToVerify[indexInterface]], valueNeeded[indexInterface], `Replace ${interfaceToVerify[indexInterface]}`);
        }
    })

    t.test('Retrieve all languages', async t => {
        const retrievedLanguages = await language.getLanguages();
        t.equal(retrievedLanguages.length, 1, 'Retrieved 1 languages');
    })

    t.end();
})
