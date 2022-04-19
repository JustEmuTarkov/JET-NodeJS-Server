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
            this.loadConfigs(),
            this.loadBots(),
            this.loadProfiles(),
        ]);

        console.timeEnd("loadDatabase");
        console.log(typeof this.core);
        console.log(typeof this.items);
        console.log(typeof this.hideout);
        console.log(typeof this.weather);
        console.log(typeof this.languages);
        console.log(typeof this.templates);
        console.log(typeof this.configs);
        console.log(typeof this.bots);

    }

    async loadCore() {
        console.log("### Database: Loading core");
        const [botBase, botCore, fleaOffer, matchMetrics] = await Promise.all([
            utils.FileIO.readFileAsync('./Server/db/base/botBase.json'),
            utils.FileIO.readFileAsync('./Server/db/base/botCore.json'),
            utils.FileIO.readFileAsync('./Server/db/base/fleaOffer.json'),
            utils.FileIO.readFileAsync('./Server/db/base/matchMetrics.json'),
        ])

        this.core = {
            botBase: JSON.parse(botBase),
            botCore: JSON.parse(botCore),
            fleaOffer: JSON.parse(fleaOffer),
            matchMetric: JSON.parse(matchMetrics),
        };
        console.log("### Database: Loaded core");
    }

    async loadItems() {
        console.log("### Database: Loading core");
        const itemsDump = JSON.parse(utils.FileIO.readFile('./Server/dumps/items.json'));

        const itemsAsArray = Object.entries(itemsDump.data);
        
        // retrieve nodes
        console.time("loadnodes");
        const nodesAsArray = itemsAsArray.filter(([key, value]) => value._type === 'Node');
        const nodes = Object.fromEntries(nodesAsArray);
        console.timeEnd("loadnodes");

        this.items = {
            "fullData":  itemsDump.data,
            "nodes": nodes
        };
        console.log("### Database: Loaded items");
    }

    async loadHideout() {
        console.log("### Database: Loading hideout");
        console.time("loadHideout");
        const [areas, productions, scavcase, settings] = await Promise.all([
            utils.FileIO.readFileAsync('./Server/dumps/hideout/areas.json'),
            utils.FileIO.readFileAsync('./Server/dumps/hideout/productions.json'),
            utils.FileIO.readFileAsync('./Server/dumps/hideout/scavcase.json'),
            utils.FileIO.readFileAsync('./Server/dumps/hideout/settings.json'),
        ]);

        this.hideout = {
            areas: JSON.parse(areas).data,
            productions: JSON.parse(productions).data,
            scavcase: JSON.parse(scavcase).data,
            settings: JSON.parse(settings).data,
        };
        console.timeEnd("loadHideout");
        console.log("### Database: Loaded hideout");
    }

    async loadWeather() {
        console.log("### Database: Loading weather");
        this.weather = JSON.parse(fs.readFileSync('./Server/dumps/weather.json', 'utf8')).data;
        console.log("### Database: Loaded weather");
    }

    async loadLanguage() {
        console.log("Loaded languages");
        this.languages = "languages";
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