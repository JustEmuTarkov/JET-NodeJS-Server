const fs = require("fs");
class User {

    constructor(ID){
        this.profilePath = global.JET.executionPath + "/user/profile/" + ID + "/";
        this.profileLoaded = false;
        if(!fs.existsSync(this.profilePath)){
            console.log(`User: ${ID}, Not Found!!!`)
            return;
        }
        this.account = new (require("./userdata/account.js"))(this.profilePath);
        this.inventory = new (require("./userdata/inventory.js"))(this.profilePath);
        this.profile = new (require("./userdata/profile.js"))(this.profilePath);
        this.quests = new (require("./userdata/quests.js"))(this.profilePath);
        this.storage = new (require("./userdata/storage.js"))(this.profilePath);
        this.trader = new (require("./userdata/trader.js"))(this.profilePath);
        this.userBuilds = new (require("./userdata/userbuilds.js"))(this.profilePath);
        this.profileLoaded = true;
    }


}
module.exports = User;