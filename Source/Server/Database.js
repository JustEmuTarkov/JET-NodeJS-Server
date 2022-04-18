
class Database {
    constructor() {
        this.core;
        this.items;
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
            this.loadLanguage(),
            this.loadTemplates(),
            this.loadConfigs(),
            this.loadBots(),
            this.loadProfiles(),
        ]);

        console.timeEnd("loadDatabase");
        console.log(typeof this.core);
        console.log(this.items);
        console.log(this.languages);
        console.log(this.templates);
        console.log(this.configs);
        console.log(this.bots);

    }

    async loadCore() {
        console.log("### Database: Loading core");
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
        console.log("### Database: Loading core");
        const itemsDump = JSON.parse(global.JET.Utils.FileIO.readFile('./Server/dumps/items.json'));

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
        console.log("Loaded items");
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
        const profilesKeys = global.JET.Utils.FileIO.getDirectories('./Server/db/profiles');
    }
}


module.exports = new Database();