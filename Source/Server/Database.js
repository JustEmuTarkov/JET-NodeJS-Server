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
            //this.loadTemplates(),
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
        //const [botBase, botCore, fleaOffer, matchMetrics] = await Promise.all([
        //    utils.FileIO.readFileAsync(),
        //    utils.FileIO.readFileAsync(),
        //    utils.FileIO.readFileAsync(),
        //    utils.FileIO.readFileAsync(),
        //])

        this.core = {
            botBase: JSON.parse(fs.readFileSync('./Server/db/base/botBase.json', 'utf8')),
            botCore: JSON.parse(fs.readFileSync('./Server/db/base/botCore.json', 'utf8')),
            fleaOffer: JSON.parse(fs.readFileSync('./Server/db/base/fleaOffer.json', 'utf8')),
            matchMetric: JSON.parse(fs.readFileSync('./Server/db/base/matchMetrics.json', 'utf8')),
        };
        console.log("### Database: Loaded core");
    }

    async loadItems() {
        console.log("### Database: Loading items");
        console.time("loadItems");
        const itemsDump = JSON.parse(fs.readFileSync('./Server/dumps/items.json', 'utf8'));

        //const itemsAsArray = Object.entries(itemsDump.data);
        
        // retrieve nodes
        //const nodesAsArray = itemsAsArray.filter(([key, value]) => value._type === 'Node');
        //const nodes = Object.fromEntries(nodesAsArray);

        this.items = {fullData: itemsDump.data}
        console.timeEnd("loadItems");
        console.log("### Database: Loaded items");
    }

    async loadHideout() {
        console.log("### Database: Loading hideout");
        console.time("loadHideout");
        //const [areas, productions, scavcase, settings] = await Promise.all([
        //    utils.FileIO.readFileAsync(),
        //    utils.FileIO.readFileAsync(),
        //    utils.FileIO.readFileAsync(),
        //    utils.FileIO.readFileAsync(),
        //]);

        this.hideout = {
            areas: JSON.parse(fs.readFileSync('./Server/dumps/hideout/areas.json', 'utf8')).data,
            productions: JSON.parse(fs.readFileSync('./Server/dumps/hideout/productions.json', 'utf8')).data,
            scavcase: JSON.parse(fs.readFileSync('./Server/dumps/hideout/scavcase.json', 'utf8')).data,
            settings: JSON.parse(fs.readFileSync('./Server/dumps/hideout/settings.json', 'utf8')).data,
        };
        console.timeEnd("loadHideout");
        console.log("### Database: Loaded hideout");
    }

    async loadWeather() {
        console.time("loadWeather");
        console.log("### Database: Loading weather");
        this.weather = JSON.parse(fs.readFileSync('./Server/dumps/weather.json', 'utf8')).data;
        console.timeEnd("loadWeather");
        console.log("### Database: Loaded weather");
    }

    async loadLanguage() {
        console.log("### Database: Loading languages");
        console.time("loadLanguage");
        const allLangs = JSON.parse(fs.readFileSync('./Server/dumps/locales/all_locales.json', 'utf8')).data;
        this.languages = {"all_locales": allLangs};
        for (const locale of allLangs) {
            const currentLocalePath = "./Server/dumps/locales/" + locale.ShortName + "/";
            if (fs.existsSync(currentLocalePath + "locales.json") && fs.existsSync(currentLocalePath + "menu.json")){
                this.languages[locale.ShortName] =  {
                    locale: JSON.parse(fs.readFileSync(currentLocalePath + "locales.json", 'utf8')).data,
                    menu: JSON.parse(fs.readFileSync(currentLocalePath + "menu.json", 'utf8')).data,
                };
                //const [localeData, menuData] = await Promise.all([
                //    utils.FileIO.readFileAsync(),
                //    utils.FileIO.readFileAsync(),
                //]);
                
            }
        }
        console.timeEnd("loadLanguage");
        console.log("### Database: Loaded languages");
    }

    async loadTemplates() {
        console.log("Loaded templates");
        this.templates = "templates";
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