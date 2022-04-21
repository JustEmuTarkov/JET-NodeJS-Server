'use strict'

const { test } = require('tap');
const database = require('../Server/Database.js');
const language = require('../Server/modules/language.js');

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

test('Initialize language', async t => {
    await database.loadDatabase();
    await language.initialize(database);
    const languageDatabase = database.languages;
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
        t.equal(languageDatabase.en.locale.interface[interfaceToVerify[indexInterface]], valueNeeded[indexInterface], `${interfaceToVerify[indexInterface]} is ${valueNeeded[indexInterface]}`);
    }
})