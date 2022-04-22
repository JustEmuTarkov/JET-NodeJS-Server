class Language {
    
    /**
     * Modify some interface in database to match JET infos.
     */
    static initialize() {
        const languageDatabase = global.JET.Database.languages;
        // todo: french & german interface ?
        languageDatabase.en.locale.interface["Attention! This is a Beta version of Escape from Tarkov for testing purposes."] = "Attention! This is Emulated version of \"Escape from Tarkov\". Provided by JustEmuTarkov Team (justemutarkov.eu).";
        languageDatabase.en.locale.interface["NDA free warning"] = "If you like this game make sure to support official creators of this game (BattleState Games).";
        languageDatabase.en.locale.interface["Offline raid description"] = "You are now entering an emulated version of a Tarkov raid. This emulated raid has all the features of a live version, but it has no connection to BSG's servers, and stays local on your PC.\nOther PMCs will spawn as emulated AI, and will spawn with randomized gear, levels, inventory, and names. This means you can loot, kill, and extract as you would online, and keep your inventory when you extract, but you cannot bring this loot into live EFT servers.\nIf you have any questions, don't hesitate to join the JustEmuTarkov Discord for assistance.";
        if(languageDatabase.ru){
            languageDatabase.ru.locale.interface["Attention! This is a Beta version of Escape from Tarkov for testing purposes."] = "Внимание! Это оффлайн версия игры \"Escape from Tarkov\", предоставленная командой JustEmuTarkov (justemutarkov.eu).";
            languageDatabase.ru.locale.interface["NDA free warning"] = "Поддержите создателей Escape From Tarkov - BattleState Games, если вам нравится эта игра.";
            languageDatabase.ru.locale.interface["Offline raid description"] = "Вы входите в оффлайн версию рейда. Он включает в себя все возможности оффициальной версии, но не имеет подключения к серверам BSG и работает локально на вашем ПК.\nДругие ЧВК появятся как ИИ и будут иметь случайное снаряжение, уровень, инвентарь и имена. Вы можете собирать лут, убивать других ЧВК и выходить с рейда так-же, как в онлайн версии, ваш инвентарь будет сохранен при выходе, но вы не можете перенести ваши вещи на оффициальную версию или наоборот.\nЕсли у вас есть вопросы, то присоедитесь к Discord серверу JustEmuTarkov.";
        }
    }

    static getLanguages() {
        const languageDatabase = global.JET.Database.languages;
        return languageDatabase.all_locales
    }
}

module.exports = Language;