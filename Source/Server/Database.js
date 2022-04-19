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
        console.time("loadDatabase");
        // load database in parallel, ms goes brrrrrrr
        await Promise.all([
            this.loadCore(),
            this.loadItems(),
            this.loadHideout(),
            this.loadWeather(),
            this.loadLanguage(),
            this.loadTemplates(),
            //this.loadBots(),
            //this.loadProfiles(),
        ]);

        // TODO: apply user settings (Server/settings/{}.json) for each database component
        // for example, hideout production times for each area, scav cases production times...
        console.timeEnd("loadDatabase");
        console.log(typeof this.core);
        console.log(typeof this.items);
        console.log(typeof this.hideout);
        console.log(typeof this.weather);
        console.log(typeof this.languages);
        //console.log(typeof this.templates);
        //console.log(typeof this.bots);

    }

    async loadCore() {
        console.log("### Database: Loading core");
        console.time("loadCore");
        this.core = {
            botBase: utils.FileIO.readParsed('./Server/db/base/botBase.json'),
            botCore: utils.FileIO.readParsed('./Server/db/base/botCore.json'),
            fleaOffer: utils.FileIO.readParsed('./Server/db/base/fleaOffer.json'),
            matchMetric: utils.FileIO.readParsed('./Server/db/base/matchMetrics.json'),
            globals: utils.FileIO.readParsed('./Server/dumps/globals.json').data,
        };
        console.timeEnd("loadCore");
        console.log("### Database: Loaded core");
    }

    async loadItems() {
        console.log("### Database: Loading items");
        console.time("loadItems");
        const itemsDump = utils.FileIO.readParsed('./Server/dumps/items.json');
        this.items = itemsDump.data;
        console.timeEnd("loadItems");
        console.log("### Database: Loaded items");
    }

    async loadHideout() {
        console.log("### Database: Loading hideout");
        console.time("loadHideout");
        this.hideout = {
            areas: utils.FileIO.readParsed('./Server/dumps/hideout/areas.json').data,
            productions: utils.FileIO.readParsed('./Server/dumps/hideout/productions.json').data,
            scavcase: utils.FileIO.readParsed('./Server/dumps/hideout/scavcase.json').data,
            settings: utils.FileIO.readParsed('./Server/dumps/hideout/settings.json').data,
        };
        console.timeEnd("loadHideout");
        console.log("### Database: Loaded hideout");
    }

    async loadWeather() {
        console.time("loadWeather");
        console.log("### Database: Loading weather");
        this.weather = utils.FileIO.readParsed('./Server/dumps/weather.json').data;
        console.timeEnd("loadWeather");
        console.log("### Database: Loaded weather");
    }

    async loadLanguage() {
        console.log("### Database: Loading languages");
        console.time("loadLanguage");
        const allLangs = utils.FileIO.readParsed('./Server/dumps/locales/all_locales.json').data;
        this.languages = {"all_locales": allLangs};
        for (const locale of allLangs) {
            const currentLocalePath = "./Server/dumps/locales/" + locale.ShortName + "/";
            if (fs.existsSync(currentLocalePath + "locales.json") && fs.existsSync(currentLocalePath + "menu.json")){
                this.languages[locale.ShortName] =  {
                    locale: utils.FileIO.readParsed(currentLocalePath + "locales.json").data,
                    menu: utils.FileIO.readParsed(currentLocalePath + "menu.json").data,
                };       
            }
        }
        console.timeEnd("loadLanguage");
        console.log("### Database: Loaded languages");
    }

    async loadTemplates() {
        console.log("Loaded templates");
        console.time("loadTemplates");
        const templatesData = utils.FileIO.readParsed('./Server/dumps/templates.json').data;
        this.templates = {
            "Categories": templatesData.Categories,
            "Items": templatesData.Items,
        };
        console.timeEnd("loadTemplates");
    }

    async loadConfigs() {
        console.log("Loaded configs");
        this.configs = "configs";
    }

    async loadBots() {
        console.log("Loaded bots");
        this.bots = "bots";
    }

    async loadProfiles() {
        console.log("### Database: Loading profiles");
        const profilesKeys = utils.FileIO.getDirectories('./Server/db/profiles');
    }
}


module.exports = new Database();