const fs = require("fs");
class Account {
    constructor(Path)
    {
        this.ProfilePath = Path; // will be used for saving account data
        let AccountData = JSON.parse(fs.readFileSync(Path + "account.json"));
        this.Id = AccountData.id;
        this.Login = AccountData.login;
        this.Password = AccountData.password;
        this.Edition = AccountData.edition;
        this.Wipe = AccountData.wipe;
        this.Lang = AccountData.lang;
    }
    async SaveAccount(){
        const Account = {
            id: this.Id,
            login: this.Login,
            password: this.Password,
            edition: this.Edition,
            wipe: this.Wipe,
            lang: this.Lang
        };
        fs.writeFile(this.ProfilePath + "account.json", JSON.stringify(Account, null, " "));
    }
    async AccountDataTest(AccountData)
    {
        if(AccountData.id == undefined)
        {
            AccountData.id = "";
        }
        if(AccountData.email == undefined)
        {
            AccountData.email = "";
        }
        if(AccountData.password == undefined)
        {
            AccountData.password = "";
        }
        if(AccountData.wipe == undefined)
        {
            AccountData.wipe = false;
        }
        if(AccountData.edition == undefined)
        {
            AccountData.edition = "Standard";
        }
        if(AccountData.lang == undefined)
        {
            AccountData.lang = "en";
        }
    }
    async CheckUser(login, password)
    {
        if(login == this.Login && password == this.Password){
            return true;
        }
        return false;
    }
}

class AccountUtils {
    /**
     * Retrieve every existing accounts from the disk
     * @returns {object} - Dict made of Accounts IDS & Accounts infos
     */
     static loadAccounts() {
        let accountsData = {};
        for (let profileID of fs.readdir('./User/Profiles')) {
            if (fs.stat("./User/Profiles/" + profileID + "/account.json")) {
                accountsData[profileID] = JSON.parse(fs.readFileSync("./User/Profiles/" + profileID + "/account.json"));
            }

        }
        return accountsData
    }

    /**
     * Find matching account
     * @param {object} accounts - Dict made of Accounts IDS & Accounts infos
     * @param {object} loginInfos - username and password combo
     * @returns accountID or false
     */
    static loginAccount(accounts, loginInfos) {
        for (let [accountID, accountInfos] of Object.entries(accounts)){
            if (accountInfos.login == loginInfos.login && accountInfos.password == loginInfos.password) {
                return accountID;
            }
        }

        return false;
    }
}

module.exports.AccountUtils = AccountUtils;
module.exports.Account = Account;