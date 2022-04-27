const util = require('../core/util.js');
const fs = require('fs');
const { fileIO } = require('../core/util.js');

class Database {
    constructor() {
        this.core;
        this.items;
        this.hideout;
        this.weather;
        this.locales;
        this.templates;
        this.bots;
        this.profiles;
        this.traders;
    }

    /**
     * Load all database component in parallel using promise.
     * It call each loading function in parallel, which in their turn call readFileAsync in parallel to retrieve every needed data.
     * No data is losed as we use await keywords to avoid completing execution without a read instruction done.
     */
    async loadDatabase() {
        util.logger.logDebug("# Database: All", 1)
        // load database in parallel, ms goes brrrrrrr
        await Promise.all([
            this.loadCore(),
            this.loadItems(),
            this.loadHideout(),
            this.loadWeather(),
            this.loadLanguage(),
            this.loadTemplates(),
            this.loadBots(),
            this.loadProfiles(),
            this.loadTraders()
        ]);

        // TODO: apply user settings (Server/settings/{}.json) for each database component
        // for example, hideout production times for each area, scav cases production times...
        util.logger.logDebug("# Database: All", 2)


    }

    async loadCore() {
        util.logger.logDebug("# Database: Loading core", 1);
        this.core = {
            serverConfig: DatabaseUtils.refreshConfig('server'),
            botBase: fileIO.readParsed('./server/db/base/botBase.json'),
            botCore: fileIO.readParsed('./server/db/base/botCore.json'),

            /**
             * As a reminder, items sold by `players` do not house the following:
             * buyRestrictionMax, loyaltyLevel
             * 
             * Their `upd` also always contains the following:
             * "SpawnedInSession": true
             * 
             * 
             * Traders are formatted as such:
             * "user": {
                    "id": "5ac3b934156ae10c4430e83c",
                    "memberType": 4
             *  }
             *
             * We may want to adjust accordingly when creating a fleaOffer
             */

            fleaOffer: fileIO.readParsed('./server/db/base/fleaOffer.json'),
            matchMetric: fileIO.readParsed('./server/db/base/matchMetrics.json'),
            globals: fileIO.readParsed('./server/dumps/globals.json').data,
        };
        util.logger.logDebug("# Database: Loading core", 2);
    }

    /**
     * Load item data in parallel.
     */
    async loadItems() {
        util.logger.logDebug("# Database: Loading items", 1)
        const itemsDump = util.fileIO.readParsed('./server/dumps/items.json');
        this.items = itemsDump.data;
        util.logger.logDebug("# Database: Loading items", 2);
    }

    /**
     * Load hideout data in parallel.
     */
    async loadHideout() {
        util.logger.logDebug("# Database: Loading hideout", 1)
        this.hideout = {
            areas: fileIO.readParsed('./server/dumps/hideout/areas.json').data,
            productions: fileIO.readParsed('./server/dumps/hideout/productions.json').data,
            scavcase: fileIO.readParsed('./server/dumps/hideout/scavcase.json').data,
            settings: fileIO.readParsed('./server/dumps/hideout/settings.json').data,
        };
        util.logger.logDebug("# Database: Loading hideout", 2)
    }

    /**
     * Load weather data in parallel.
     */
    async loadWeather() {
        util.logger.logDebug("# Database: Loading weather", 1)
        this.weather = fileIO.readParsed('./server/dumps/weather.json').data;
        util.logger.logDebug("# Database: Loading weather", 2)
    }

    /**
     * Load language data in parallel.
     */
    async loadLanguage() {
        util.logger.logDebug("# Database: Loading languages", 1)
        const allLangs = fileIO.readParsed('./server/dumps/locales/languages.json', 'utf8').data;
        this.locales = { "languages": [] };
        for (const locale of allLangs) {
            const currentLocalePath = "server/dumps/locales/" + locale.ShortName + "/";
            if (fileIO.fileExist(currentLocalePath + "locales.json") && fileIO.fileExist(currentLocalePath + "menu.json")) {
                this.locales[locale.ShortName] = {
                    locale: fileIO.readParsed(currentLocalePath + "locales.json").data,
                    menu: fileIO.readParsed(currentLocalePath + "menu.json").data,
                };
                this.locales.languages.push(locale);
            }
        }
        util.logger.logDebug("# Database: Loading languages", 2)
    }

    /**
     * Load templates data in parallel.
     */
    async loadTemplates() {
        util.logger.logDebug("# Database: Loading templates", 1)
        const templatesData = fileIO.readParsed('./server/dumps/templates.json').data;
        this.templates = {
            "Categories": templatesData.Categories,
            "Items": templatesData.Items,
        };
        util.logger.logDebug("# Database: Loading templates", 2)
    }

    /**
     * Load bots data in parallel.
     */
    async loadBots() {
        util.logger.logDebug("# Database: Loading bots", 1)
        const botTypes = fileIO.getDirectoriesFrom('./server/db/bots');
        this.bots = {};
        for (let botType of botTypes) {
            const folderPath = `./server/db/bots/${botType}/`;
            const dificulties = fileIO.getFilesFrom(`${folderPath}difficulty`);
            const inventories = fileIO.getFilesFrom(`${folderPath}inventory`);
            this.bots[botType] = {};
            this.bots[botType]["difficulty"] = {};
            this.bots[botType]["inventory"] = {};
            for (let difficulty of dificulties) {
                this.bots[botType]["difficulty"][difficulty.replace(".json", "")] = fileIO.readParsed(`${folderPath}difficulty/${difficulty}`);
            }

            for (let inventory of inventories) {
                this.bots[botType]["inventory"][inventory.replace(".json", "")] = fileIO.readParsed(`${folderPath}inventory/${inventory}`);
            }

            this.bots[botType]["appearance"] = fileIO.readParsed(`${folderPath}appearance.json`);
            this.bots[botType]["chances"] = fileIO.readParsed(`${folderPath}chances.json`);
            this.bots[botType]["experience"] = fileIO.readParsed(`${folderPath}experience.json`);
            this.bots[botType]["generation"] = fileIO.readParsed(`${folderPath}generation.json`);
            this.bots[botType]["health"] = fileIO.readParsed(`${folderPath}health.json`);
            // bot names are in db.base.botNames
        }
        util.logger.logDebug("# Database: Loading bots", 2)
    }

    /**
     * Load profiles data in parallel.
     */
    async loadProfiles() {
        util.logger.logDebug("# Database: Loading profiles", 1)
        const profilesKeys = fileIO.getDirectoriesFrom('./server/db/profiles');
        this.profiles = {};
        for (let profileType of profilesKeys) {
            const path = `./server/db/profiles/${profileType}/`;
            this.profiles[profileType] = {};
            this.profiles[profileType]["character"] = fileIO.readParsed(`${path}character.json`);
            this.profiles[profileType]["initialTraderStanding"] = fileIO.readParsed(`${path}initialTraderStanding.json`);
            this.profiles[profileType]["inventory_bear"] = fileIO.readParsed(`${path}inventory_bear.json`);
            this.profiles[profileType]["inventory_usec"] = fileIO.readParsed(`${path}inventory_usec.json`);
            //this.profiles[profileType]["starting_outfit"] = util.fileIO.readParsed(`${path}starting_outfit.json`);
            this.profiles[profileType]["storage"] = fileIO.readParsed(`${path}storage.json`);
        }
        util.logger.logDebug("# Database: Loading profiles", 2)
    }

    /**
     * Load traders base data in parallel.
     */
    async loadTraders() {
        util.logger.logDebug("# Database: Loading traders", 1)
        const traderKeys = fileIO.getDirectoriesFrom('./server/dumps/traders');
        this.traders = { names: {} };
        for (let traderID of traderKeys) {

            const path = `./server/dumps/traders/${traderID}/`;
            this.traders[traderID] = { base: {}, assort: {}, categories: {} };

            // read base and assign to variable
            const traderBase = fileIO.readParsed(`${path}base.json`);
            this.traders[traderID].base = traderBase

            // create names object and assign trader nickname to traderID
            let nickname = traderBase.nickname;
            if (nickname === "Unknown") nickname = "Ragfair";
            this.traders.names[nickname] = traderID;

            // if quest assort exists, read and assign to variable
            if (fileIO.fileExist(`${path}questassort.json`)) {
                this.traders[traderID].questassort = fileIO.readParsed(`${path}questassort.json`);
            }

            // read assort and assign to variable
            let assort = fileIO.readParsed(`${path}assort.json`);
            // give support for assort dump files
            if (!util.tools.isUndefined(assort.data)) {
                assort = assort.data;
            }
            this.traders[traderID].assort = assort;

            // check if suits exists, read and assign to variable
            if (fileIO.fileExist(`${path}suits.json`)) {
                this.traders[traderID].suits = fileIO.readParsed(`${path}suits.json`);
            }

            // check if dialogue exists, read and assign to variable
            if (fileIO.fileExist(`${path}dialogue.json`)) {
                this.traders[traderID].dialogue = fileIO.readParsed(`${path}dialogue.json`);
            }
        }

        /**
         * Ragfair will need to be regenerated to the database later
         * so that we can populate the assort with the correct/missing item data.
         * It may be best to do this as a separate step, and call it here.
         */

        util.logger.logDebug("# Database: Loading traders", 2)
    }

    async regenerateRagfair() {
        /**
         * Ragfair needs to be created in a meticulous way this time around
         * We need to compensate for the fact that the items in the assort
         * won't always be correct or up to date, so we need to create functions
         * to generate that data, and then use that data to populate the flea.
         */
    }
}

class DatabaseUtils {


    /**
     * Refresh and return config file with new values if needed.
     * @param {string} type 'server' or 'gameplay'
     * @return {object} config object
     */
    static refreshConfig(type) {
        switch (type) {
            case 'gameplay':
                let gpconfig = fileIO.readParsed('server/db/config/gameplay_base.json');
                const gppath = 'server/db/config/gameplay.json';
                if (!fileIO.fileExist(gppath)) fileIO.writeFile(gppath, JSON.stringify(gpconfig));

                let gpjson = {};
                if (fileIO.fileExist(gppath)) gpjson = fileIO.readParsed(gppath);

                let gpChanges = false;
                for (let item in gpconfig) {
                    if (gpjson[item] === undefined) {
                        gpjson[item] = gpconfig[item];
                        util.logger.logInfo("Adding Config Setting " + item + " to gameplay.json");
                        gpChanges = true;
                    }
                }

                if (gpChanges) fileIO.writeFile(gppath, gpjson);
                return fileIO.readParsed(gppath);

            case 'server':
                let base = fileIO.readParsed('server/db/config/server_base.json');
                let newBase;
                const srvpath = 'server/db/config/server.json';
                if (!fileIO.fileExist(srvpath)) {
                    fileIO.writeFile(srvpath, base);
                }

                if (fileIO.fileExist(srvpath)) {
                    newBase = fileIO.readParsed(srvpath);
                }

                let srvChanges = false;
                for (let item in base) {
                    if (newBase[item] === undefined) {
                        newBase[item] = base[item];
                        logger.logInfo("Adding Config Setting " + item + " to server.json");
                        srvChanges = true;
                    }
                }

                if (srvChanges) fileIO.writeFile(srvpath, srvjson);

                return fileIO.readParsed(srvpath);
        }
    }

}


module.exports = new Database();