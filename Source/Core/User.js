const fs = require("fs");
class User {

    constructor(Id){
        this.ProfilePath = global.JET.ExecutionPath + "/User/Profile/" + Id + "/";
        this.ProfileLoaded = false;
        if(!fs.existsSync(this.ProfilePath)){
            console.log(`User: ${Id}, Not Found!!!`)
            return;
        }
        this.Account = new (require("./UserData/Account.js"))(this.ProfilePath);
        this.Inventory = new (require("./UserData/Inventory.js"))(this.ProfilePath);
        this.Profile = new (require("./UserData/Profile.js"))(this.ProfilePath);
        this.Quests = new (require("./UserData/Quests.js"))(this.ProfilePath);
        this.Storage = new (require("./UserData/Storage.js"))(this.ProfilePath);
        this.Trader = new (require("./UserData/Trader.js"))(this.ProfilePath);
        this.UserBuilds = new (require("./UserData/UserBuilds.js"))(this.ProfilePath);
        this.ProfileLoaded = true;
    }


}
module.exports = User;