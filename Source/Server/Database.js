

class Database {
    constructor() {
        this.core;
        this.items;
        this.languages;
        this.templates;
        this.configs;
        this.bots;
    }

    async loadDatabase(){
        //[this.core, this.items, this.languages, this.templates, this.configs, this.bots] =
        console.time("loadDatabase")
        // load database in parallel, ms goes brrrrrrr
        Promise.all([
            this.loadCore(),
            this.loadItems(),
            this.loadLanguage(),
            this.loadTemplates(),
            this.loadConfigs(),
            this.loadBots(),
        ])

        console.timeEnd("loadDatabase")
        console.log(this.core);
        console.log(this.items);
        console.log(this.languages);
        console.log(this.templates);
        console.log(this.configs);
        console.log(this.bots);

    }

    async loadCore() {
        console.log("### Database: Loading core");
        console.log(process.cwd())
        const [botBase, botCore, fleaOffer, matchMetrics] = await Promise.all([
            global.JET.Utils.FileIO.readFileAsync('./Server/db/base/botBase.json'),
            global.JET.Utils.FileIO.readFileAsync('./Server/db/base/botCore.json'),
            global.JET.Utils.FileIO.readFileAsync('./Server/db/base/fleaOffer.json'),
            global.JET.Utils.FileIO.readFileAsync('./Server/db/base/matchMetrics.json'),
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
        console.log("Loaded items");
        this.items = "items";
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
}


module.exports = new Database();