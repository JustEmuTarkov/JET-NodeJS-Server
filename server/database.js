const utils = require('../core/utils.js');
const fs = require('fs')

class Database {
    constructor() {
        this.core;
        this.items;
        this.hideout;
        this.weather;
        this.languages;
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
        utils.logger.LogDebug("# Database: All", 1)
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
            //this.loadTraders()
        ]);

        // TODO: apply user settings (Server/settings/{}.json) for each database component
        // for example, hideout production times for each area, scav cases production times...
        utils.logger.LogDebug("# Database: All", 2)


    }

    async loadCore() {
        utils.logger.LogDebug("# Database: Loading core", 1);
        this.core = {
            botBase: utils.fileIO.readParsed('./server/db/base/botBase.json'),
            botCore: utils.fileIO.readParsed('./server/db/base/botCore.json'),
            fleaOffer: utils.fileIO.readParsed('./server/db/base/fleaOffer.json'),
            matchMetric: utils.fileIO.readParsed('./server/db/base/matchMetrics.json'),
            globals: utils.fileIO.readParsed('./server/dumps/globals.json').data,
        };
        utils.logger.LogDebug("# Database: Loading core", 2);
    }

    async loadItems() {
        utils.logger.LogDebug("# Database: Loading items", 1)
        const itemsDump = utils.fileIO.readParsed('./server/dumps/items.json');
        this.items = itemsDump.data;
        utils.logger.LogDebug("# Database: Loading items", 2);
    }

    async loadHideout() {
        utils.logger.LogDebug("# Database: Loading hideout", 1)
        this.hideout = {
            areas: utils.fileIO.readParsed('./server/dumps/hideout/areas.json').data,
            productions: utils.fileIO.readParsed('./server/dumps/hideout/productions.json').data,
            scavcase: utils.fileIO.readParsed('./server/dumps/hideout/scavcase.json').data,
            settings: utils.fileIO.readParsed('./server/dumps/hideout/settings.json').data,
        };
        utils.logger.LogDebug("# Database: Loading hideout", 2)
    }

    async loadWeather() {
        utils.logger.LogDebug("# Database: Loading weather", 1)
        this.weather = utils.fileIO.readParsed('./server/dumps/weather.json').data;
        utils.logger.LogDebug("# Database: Loading weather", 2)
    }

    async loadLanguage() {
        utils.logger.LogDebug("# Database: Loading languages", 1)
        const allLangs = utils.fileIO.readParsed('./server/dumps/locales/all_locales.json', 'utf8').data;
        this.languages = { "all_locales": [] };
        for (const locale of allLangs) {
            const currentLocalePath = "server/dumps/locales/" + locale.ShortName + "/";
            if (utils.fileIO.fileExist(currentLocalePath + "locales.json") && utils.fileIO.fileExist(currentLocalePath + "menu.json")) {
                this.languages[locale.ShortName] = {
                    locale: utils.fileIO.readParsed(currentLocalePath + "locales.json").data,
                    menu: utils.fileIO.readParsed(currentLocalePath + "menu.json").data,
                };
                this.languages.all_locales.push(locale);
            }
        }
        utils.logger.LogDebug("# Database: Loading languages", 2)
    }

    async loadTemplates() {
        utils.logger.LogDebug("# Database: Loading templates", 1)
        const templatesData = utils.fileIO.readParsed('./server/dumps/templates.json').data;
        this.templates = {
            "Categories": templatesData.Categories,
            "Items": templatesData.Items,
        };
        utils.logger.LogDebug("# Database: Loading templates", 2)
    }

    async loadConfigs() {
        utils.logger.LogDebug("# Database: Loading configs", 1)
        this.configs = "configs";
        utils.logger.LogDebug("# Database: Loading configs", 2)
    }

    async loadBots() {
        utils.logger.LogDebug("# Database: Loading bots", 1)
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
        utils.logger.LogDebug("# Database: Loading bots", 2)
    }

    async loadProfiles() {
        utils.logger.LogDebug("# Database: Loading profiles", 1)
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
        utils.logger.LogDebug("# Database: Loading profiles", 2)
    }

    async loadTraders() {
        utils.logger.LogDebug("# Database: Loading traders", 1)
        const traders = utils.fileIO.getDirectoriesFrom('./server/dumps/traders');
        this.traders = {};
        for (let traderID in traders) {
            const path = `./server/dumps/traders/${traderID}/`;
            traders.trader[traderID] = { base: {}, assort: {}, categories: {} };

            traders.trader[traderID].base = utils.fileIO.readParsed(`./server/dumps/traders/${path}/base.json`);

            if ("questassort" in traders.trader[traderID]) {
                traders.trader[traderID].questassort = utils.fileIO.readParsed(`./server/dumps/traders/${path}/questassort.json`);
            }

            traders.trader[traderID].assort = utils.fileIO.readParsed(`./server/dumps/traders/${path}/assort.json`);
            if (typeof traders.trader[traderID].assort.data != "undefined") { traders.trader[traderID].assort = traders.trader[traderID].assort.data; }
        }
        // Ragfair will need to be generated or added to the database later
        utils.logger.LogDebug("# Database: Loading traders", 2)
    }
}


module.exports = new Database();