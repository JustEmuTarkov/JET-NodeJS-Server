const utils = require('../core/utils.js');
const fs = require('fs');
const { fileIO } = require('../core/utils.js');

class Database {
    constructor() {
        this.core;
        this.items;
        this.hideout;
        this.weather;
        this.locales;
        this.templates;
        this.configs;
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
        utils.logger.logDebug("# Database: All", 1)
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
        utils.logger.logDebug("# Database: All", 2)


    }

    async loadCore() {
        utils.logger.logDebug("# Database: Loading core", 1);
        this.core = {
            botBase: utils.fileIO.readParsed('./server/db/base/botBase.json'),
            botCore: utils.fileIO.readParsed('./server/db/base/botCore.json'),

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

            fleaOffer: utils.fileIO.readParsed('./server/db/base/fleaOffer.json'),
            matchMetric: utils.fileIO.readParsed('./server/db/base/matchMetrics.json'),
            globals: utils.fileIO.readParsed('./server/dumps/globals.json').data,
        };
        utils.logger.logDebug("# Database: Loading core", 2);
    }

    /**
     * Load item data in parallel.
     */
    async loadItems() {
        utils.logger.logDebug("# Database: Loading items", 1)
        const itemsDump = utils.fileIO.readParsed('./server/dumps/items.json');
        this.items = itemsDump.data;
        utils.logger.logDebug("# Database: Loading items", 2);
    }

    /**
     * Load hideout data in parallel.
     */
    async loadHideout() {
        utils.logger.logDebug("# Database: Loading hideout", 1)
        this.hideout = {
            areas: utils.fileIO.readParsed('./server/dumps/hideout/areas.json').data,
            productions: utils.fileIO.readParsed('./server/dumps/hideout/productions.json').data,
            scavcase: utils.fileIO.readParsed('./server/dumps/hideout/scavcase.json').data,
            settings: utils.fileIO.readParsed('./server/dumps/hideout/settings.json').data,
        };
        utils.logger.logDebug("# Database: Loading hideout", 2)
    }

    /**
     * Load weather data in parallel.
     */
    async loadWeather() {
        utils.logger.logDebug("# Database: Loading weather", 1)
        this.weather = utils.fileIO.readParsed('./server/dumps/weather.json').data;
        utils.logger.logDebug("# Database: Loading weather", 2)
    }

    /**
     * Load language data in parallel.
     */
    async loadLanguage() {
        utils.logger.logDebug("# Database: Loading languages", 1)
        const allLangs = utils.fileIO.readParsed('./server/dumps/locales/languages.json', 'utf8').data;
        this.locales = { "languages": [] };
        for (const locale of allLangs) {
            const currentLocalePath = "server/dumps/locales/" + locale.ShortName + "/";
            if (utils.fileIO.fileExist(currentLocalePath + "locales.json") && utils.fileIO.fileExist(currentLocalePath + "menu.json")) {
                this.locales[locale.ShortName] = {
                    locale: utils.fileIO.readParsed(currentLocalePath + "locales.json").data,
                    menu: utils.fileIO.readParsed(currentLocalePath + "menu.json").data,
                };
                this.locales.languages.push(locale);
            }
        }
        utils.logger.logDebug("# Database: Loading languages", 2)
    }

    /**
     * Load templates data in parallel.
     */
    async loadTemplates() {
        utils.logger.logDebug("# Database: Loading templates", 1)
        const templatesData = utils.fileIO.readParsed('./server/dumps/templates.json').data;
        this.templates = {
            "Categories": templatesData.Categories,
            "Items": templatesData.Items,
        };
        utils.logger.logDebug("# Database: Loading templates", 2)
    }

    /**
     * Load configs data in parallel.
     */
    async loadConfigs() {
        utils.logger.logDebug("# Database: Loading configs", 1)
        this.configs = "configs";
        utils.logger.logDebug("# Database: Loading configs", 2)
    }

    /**
     * Load bots data in parallel.
     */
    async loadBots() {
        utils.logger.logDebug("# Database: Loading bots", 1)
        const botTypes = utils.fileIO.getDirectoriesFrom('./server/db/bots');
        this.bots = {};
        for (let botType of botTypes) {
            const folderPath = `./server/db/bots/${botType}/`;
            const dificulties = utils.fileIO.getFilesFrom(`${folderPath}difficulty`);
            const inventories = utils.fileIO.getFilesFrom(`${folderPath}inventory`);
            this.bots[botType] = {};
            this.bots[botType]["difficulty"] = {};
            this.bots[botType]["inventory"] = {};
            for (let difficulty of dificulties) {
                this.bots[botType]["difficulty"][difficulty.replace(".json", "")] = utils.fileIO.readParsed(`${folderPath}difficulty/${difficulty}`);
            }

            for (let inventory of inventories) {
                this.bots[botType]["inventory"][inventory.replace(".json", "")] = utils.fileIO.readParsed(`${folderPath}inventory/${inventory}`);
            }

            this.bots[botType]["appearance"] = utils.fileIO.readParsed(`${folderPath}appearance.json`);
            this.bots[botType]["chances"] = utils.fileIO.readParsed(`${folderPath}chances.json`);
            this.bots[botType]["experience"] = utils.fileIO.readParsed(`${folderPath}experience.json`);
            this.bots[botType]["generation"] = utils.fileIO.readParsed(`${folderPath}generation.json`);
            this.bots[botType]["health"] = utils.fileIO.readParsed(`${folderPath}health.json`);
            // bot names are in db.base.botNames
        }
        utils.logger.logDebug("# Database: Loading bots", 2)
    }

    /**
     * Load profiles data in parallel.
     */
    async loadProfiles() {
        utils.logger.logDebug("# Database: Loading profiles", 1)
        const profilesKeys = utils.fileIO.getDirectoriesFrom('./server/db/profiles');
        this.profiles = {};
        for (let profileType of profilesKeys) {
            const path = `./server/db/profiles/${profileType}/`;
            this.profiles[profileType] = {};
            this.profiles[profileType]["character"] = utils.fileIO.readParsed(`${path}character.json`);
            this.profiles[profileType]["initialTraderStanding"] = utils.fileIO.readParsed(`${path}initialTraderStanding.json`);
            this.profiles[profileType]["inventory_bear"] = utils.fileIO.readParsed(`${path}inventory_bear.json`);
            this.profiles[profileType]["inventory_usec"] = utils.fileIO.readParsed(`${path}inventory_usec.json`);
            //this.profiles[profileType]["starting_outfit"] = utils.fileIO.readParsed(`${path}starting_outfit.json`);
            this.profiles[profileType]["storage"] = utils.fileIO.readParsed(`${path}storage.json`);
        }
        utils.logger.logDebug("# Database: Loading profiles", 2)
    }

    /**
     * Load traders base data in parallel.
     */
    async loadTraders() {
        utils.logger.logDebug("# Database: Loading traders", 1)
        const traderKeys = utils.fileIO.getDirectoriesFrom('./server/dumps/traders');
        let traders = {};
        for (let traderID of traderKeys) {
            const path = `./server/dumps/traders/${traderID}/`;
            traders[traderID] = { base: {}, assort: {}, categories: {} };

            // read base and assign to variable
            traders[traderID].base = utils.fileIO.readParsed(`${path}base.json`);

            // if quest assort exists, read and assign to variable
            if (utils.fileIO.fileExist(`${path}questassort.json`)) {
                traders[traderID].questassort = utils.fileIO.readParsed(`${path}questassort.json`);
            }

            // read assort and assign to variable
            traders[traderID].assort = utils.fileIO.readParsed(`${path}assort.json`);
            // give support for assort dump files
            if (!utils.tools.isUndefined(traders[traderID].assort.data)) {
                traders[traderID].assort = traders[traderID].assort.data;
            }

            // read suits and assign to variable
            if (utils.fileIO.fileExist(`${path}suits.json`)) {
                traders[traderID].suits = utils.fileIO.readParsed(`${path}suits.json`);
            }
        }

        /**
         * Ragfair will need to be regenerated to the database later
         * so that we can populate the assort with the correct/missing item data.
         * It may be best to do this as a separate step, and call it here.
         */

        utils.logger.logDebug("# Database: Loading traders", 2)
    }
}


module.exports = new Database();