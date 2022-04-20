const utils = require('../Core/Utils.js');

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
    }

    /**
     * Load all database component in parallel using promise.
     * It call each loading function in parallel, which in their turn call readFileAsync in parallel to retrieve every needed data.
     * No data is losed as we use await keywords to avoid completing execution without a read instruction done.
     */
    async loadDatabase(){
        JET.Utils.Logger.LogDebug("# Database: All", 1)
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
        ]);

        // TODO: apply user settings (Server/settings/{}.json) for each database component
        // for example, hideout production times for each area, scav cases production times...
        JET.Utils.Logger.LogDebug("# Database: All", 2)


    }

    async loadCore() {
        return new Promise((resolve => {
            JET.Utils.Logger.LogDebug("# Database: Loading core", 1);
            this.core = {
                botBase: utils.FileIO.readParsed('./Server/db/base/botBase.json'),
                botCore: utils.FileIO.readParsed('./Server/db/base/botCore.json'),
                fleaOffer: utils.FileIO.readParsed('./Server/db/base/fleaOffer.json'),
                matchMetric: utils.FileIO.readParsed('./Server/db/base/matchMetrics.json'),
                globals: utils.FileIO.readParsed('./Server/dumps/globals.json').data,
            };
            JET.Utils.Logger.LogDebug("# Database: Loading core", 2);
            resolve();
        }));
    }

    async loadItems() {
        return new Promise((resolve => {
            JET.Utils.Logger.LogDebug("# Database: Loading items", 1)
            const itemsDump = utils.FileIO.readParsed('./Server/dumps/items.json');
            this.items = itemsDump.data;
            JET.Utils.Logger.LogDebug("# Database: Loading items", 2);
            resolve();
        }));
    }

    async loadHideout() {
        return new Promise((resolve => {
            JET.Utils.Logger.LogDebug("# Database: Loading hideout", 1)
            this.hideout = {
                areas: utils.FileIO.readParsed('./Server/dumps/hideout/areas.json').data,
                productions: utils.FileIO.readParsed('./Server/dumps/hideout/productions.json').data,
                scavcase: utils.FileIO.readParsed('./Server/dumps/hideout/scavcase.json').data,
                settings: utils.FileIO.readParsed('./Server/dumps/hideout/settings.json').data,
            };
            JET.Utils.Logger.LogDebug("# Database: Loading hideout", 2)
            resolve();
        }));
    }

    async loadWeather() {
        return new Promise((resolve => {
            JET.Utils.Logger.LogDebug("# Database: Loading weather", 1)
            this.weather = utils.FileIO.readParsed('./Server/dumps/weather.json').data;
            JET.Utils.Logger.LogDebug("# Database: Loading weather", 2)
            resolve();
        }));
    }

    async loadLanguage() {
        return new Promise((resolve => {
            JET.Utils.Logger.LogDebug("# Database: Loading languages", 1)
            const allLangs = utils.FileIO.readParsed('./Server/dumps/locales/all_locales.json', 'utf8').data;
            this.languages = {"all_locales": allLangs};
            for (const locale of allLangs) {
                const currentLocalePath = "Server/dumps/locales/" + locale.ShortName + "/";
                if (utils.FileIO.fileExist(currentLocalePath + "locales.json") && utils.FileIO.fileExist(currentLocalePath + "menu.json")){
                    this.languages[locale.ShortName] =  {
                        locale: utils.FileIO.readParsed(currentLocalePath + "locales.json").data,
                        menu: utils.FileIO.readParsed(currentLocalePath + "menu.json").data,
                    };       
                }
            }
            JET.Utils.Logger.LogDebug("# Database: Loading languages", 2)
            resolve();
        }));
    }

    async loadTemplates() {
        return new Promise((resolve => {
            JET.Utils.Logger.LogDebug("# Database: Loading templates", 1)
            const templatesData = utils.FileIO.readParsed('./Server/dumps/templates.json').data;
            this.templates = {
                "Categories": templatesData.Categories,
                "Items": templatesData.Items,
            };
            JET.Utils.Logger.LogDebug("# Database: Loading templates", 2)
            resolve();
        }));
    }

    async loadConfigs() {
        return new Promise((resolve => {
            JET.Utils.Logger.LogDebug("# Database: Loading configs", 1)
            this.configs = "configs";
            JET.Utils.Logger.LogDebug("# Database: Loading configs", 2)
            resolve();
        }));
    }

    async loadBots() {
        return new Promise((resolve => {
            JET.Utils.Logger.LogDebug("# Database: Loading bots", 1)
            const botTypes = utils.FileIO.getDirectoriesFrom('./Server/db/bots');
            this.bots = {};
            for(let botType of botTypes){
                const folderPath = `./Server/db/bots/${botType}/`;
                const dificulties = utils.FileIO.getFilesFrom(`${folderPath}difficulty`);
                const inventories = utils.FileIO.getFilesFrom(`${folderPath}inventory`);
                this.bots[botType] = {};
                this.bots[botType]["difficulty"] = {};
                this.bots[botType]["inventory"] = {};
                for(let difficulty of dificulties){
                    this.bots[botType]["difficulty"][difficulty.replace(".json", "")] = utils.FileIO.readParsed(`${folderPath}difficulty/${difficulty}`);
                }
                
                for(let inventory of inventories){
                    this.bots[botType]["inventory"][inventory.replace(".json", "")] = utils.FileIO.readParsed(`${folderPath}inventory/${inventory}`);
                }
                
                this.bots[botType]["appearance"] = utils.FileIO.readParsed(`${folderPath}appearance.json`);
                this.bots[botType]["chances"] = utils.FileIO.readParsed(`${folderPath}chances.json`);
                this.bots[botType]["experience"] = utils.FileIO.readParsed(`${folderPath}experience.json`);
                this.bots[botType]["generation"] = utils.FileIO.readParsed(`${folderPath}generation.json`);
                this.bots[botType]["health"] = utils.FileIO.readParsed(`${folderPath}health.json`);
                // bot names are in db.base.botNames
            }
            JET.Utils.Logger.LogDebug("# Database: Loading bots", 2)
            resolve();
        }));
    }

    async loadProfiles() {
        return new Promise((resolve => {
            JET.Utils.Logger.LogDebug("# Database: Loading profiles", 1)
            const profilesKeys = utils.FileIO.getDirectoriesFrom('./Server/db/profiles');
            this.profiles = {};
            for(let profileType of profilesKeys){
                const path = `./Server/db/profiles/${profileType}/`;
                this.profiles[profileType] = {};
                this.profiles[profileType]["character"] = utils.FileIO.readParsed(`${path}character.json`);
                this.profiles[profileType]["initialTraderStanding"] = utils.FileIO.readParsed(`${path}initialTraderStanding.json`);
                this.profiles[profileType]["inventory_bear"] = utils.FileIO.readParsed(`${path}inventory_bear.json`);
                this.profiles[profileType]["inventory_usec"] = utils.FileIO.readParsed(`${path}inventory_usec.json`);
                //this.profiles[profileType]["starting_outfit"] = utils.FileIO.readParsed(`${path}starting_outfit.json`);
                this.profiles[profileType]["storage"] = utils.FileIO.readParsed(`${path}storage.json`);
            }
            JET.Utils.Logger.LogDebug("# Database: Loading profiles", 2)
            resolve();
        }));
    }
}


module.exports = new Database();