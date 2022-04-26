const fs = require("fs");
const { fileIO } = require("../util.js");
const { logger } = require("../util.js");

class Account {
    constructor(path) {
        this.profilePath = path; // will be used for saving account data
        let accountData = fileIO.readParsed(path + "account.json");
        this.id = accountData.id;
        this.login = accountData.login;
        this.password = accountData.password;
        this.edition = accountData.edition;
        this.wipe = accountData.wipe;
        this.lang = accountData.lang;
    }
    async saveAccount() {
        const Account = {
            id: this.id,
            login: this.login,
            password: this.password,
            edition: this.edition,
            wipe: this.wipe,
            lang: this.lang
        };
        fileIO.writeFile(this.profilePath + "account.json", JSON.stringify(Account, null, " "));
    }
    async accountDataTest(accountData) {
        if (accountData.id == undefined) {
            accountData.id = "";
        }
        if (accountData.email == undefined) {
            accountData.email = "";
        }
        if (accountData.password == undefined) {
            accountData.password = "";
        }
        if (accountData.wipe == undefined) {
            accountData.wipe = false;
        }
        if (accountData.edition == undefined) {
            accountData.edition = "Standard";
        }
        if (accountData.lang == undefined) {
            accountData.lang = "en";
        }
    }
    async checkUser(login, password) {
        if (login == this.login && password == this.password) {
            return true;
        }
        return false;
    }
}

class AccountUtils {

    /**
     * Memory storage for accounts and their file age.
     * Unsure if this is needed
     */
    constructor() {
        this.accounts = {};
        this.accountFileAge = {};
    }

    /**
     * Retrieve every existing accounts from the disk
     * @returns {object} Dict made of Accounts IDS & Accounts infos
     */
    static loadAccounts() {
        let accountsData = {};
        for (const profileID of fs.readdir('./user/profiles')) {
            if (fs.stat("./user/profiles/" + profileID + "/account.json")) {
                accountsData[profileID] = fileIO.readParsed("./user/profiles/" + profileID + "/account.json");
            }

        }
        return accountsData
    }

    /**
     * Return directory of account IDs
     * @returns {object} - Dict made of Accounts IDS & Accounts infos
     */
    static getList() {
        return this.accounts;
    }

    /**
     * Find matching account
     * @param {object} accounts - Dict made of Accounts IDS & Accounts infos
     * @param {object} loginInfos - username and password combo
     * @returns accountID or false
     */
    static loginAccount(accounts, loginInfos) {
        for (const [accountID, accountInfos] of Object.entries(accounts)) {
            if (accountInfos.login == loginInfos.login && accountInfos.password == loginInfos.password) {
                return accountID;
            }
        }

        return false;
    }

    /**
    * Check if the client has a profile. This function will be used by the response "/client/game/start" and determine, if a new profile will be created.
    * @param {*} sessionID 
    * @returns If the account exists.
    */
    static clientHasProfile(sessionID) {
        this.reloadAccountBySessionID(sessionID)
        const accounts = this.getList();
        for (const account in accounts) {
            if (account == sessionID) {
                if (!fileIO.fileExist("./user/profiles/" + sessionID + "/character.json")) {
                    logger.logSuccess(`[CLUSTER] New account ${sessionID} logged in!`);
                }
                return true
            }
        }
        return false
    }

    /**
   * Reloads the account stored in memory for a specific session (aka. accountID), if the file was modified elsewhere.
   * @param {*} sessionID 
   */
    static reloadAccountBySessionID(sessionID) {
        if (!fileIO.fileExist(`./user/profiles/${sessionID}/account.json`)) {
            logger.logWarning(`[CLUSTER] Account file for account ${sessionID} does not exist.`);
        } else {
            // Does the session exist?
            if (!this.accounts[sessionID]) {
                logger.logWarning(`[CLUSTER] Tried to load session ${sessionID} but it wasn't cached, loading.`);
                // Reload the account from disk.
                this.accounts[sessionID] = fileIO.readParsed(`./user/profiles/${sessionID}/account.json`);
                // Set the file age for this users account file.
                const stats = fs.statSync(`./user/profiles/${sessionID}/account.json`);
                this.accountFileAge[sessionID] = stats.mtimeMs;
            } else {
                // Check if the file was modified by another cluster member using the file age.
                const stats = fs.statSync(`./user/profiles/${sessionID}/account.json`);
                if (stats.mtimeMs != this.accountFileAge[sessionID]) {
                    logger.logWarning(`[CLUSTER] Account file for account ${sessionID} was modified, reloading.`);

                    // Reload the account from disk.
                    this.accounts[sessionID] = fileIO.readParsed(`./user/profiles/${sessionID}/account.json`);
                    // Reset the file age for this users account file.
                    this.accountFileAge[sessionID] = stats.mtimeMs;
                }
            }
        }
    }
}

module.exports.AccountUtils = AccountUtils;
module.exports.Account = Account;