const fs = require("fs");
const { fileIO } = require("../util.js");
const { logger } = require("../util.js");

class Account {
    constructor() {
        this.accounts = {};
        this.accountFileAge = {};
    }

    /**
    * reloadAccountByLogin functions checks for changes in profile account data on user login and loads accounts on demand.
    * @param {*} info 
    * @returns user account ID
    */
     static reloadAccountByLogin(info) {
        /**
         * Read account files from cache that were already loaded by the second part of this function.
         * If the file was changed (for example, by another cluster member), the account file gets reloaded from disk.
         */
        for (const accountID in this.accounts) {
            const account = this.accounts[accountID];

            // Does the account information match any cached account?
            if (info.email === account.email && info.password === account.password) {
                // Check if the file was modified by another cluster member using the file age.
                const stats = fs.statSync(`./user/profiles/${accountID}/account.json`);
                if (stats.mtimeMs != this.accountFileAge[accountID]) {
                    logger.logWarning(`[CLUSTER] Account file for account ${accountID} was modified, reloading.`);
                    // Reload the account from disk.
                    this.accounts[accountID] = fileIO.readParsed(`./user/profiles/${accountID}/account.json`);
                    // Reset the file age for this users account file.
                    this.accountFileAge[accountID] = stats.mtimeMs;
                }

                return accountID;
            }
        }

        /**
         * Read account files from disk for accounts that are not cached already.
         */
        const profileIDs = fs.readdir("./user/profiles");
        for (const id in profileIDs) {
            if (!fileIO.fileExist(`./user/profiles/${profileIDs[id]}/account.json`)) {
                logger.logWarning(`[CLUSTER] Account file for account ${profileIDs[id]} does not exist.`);
            } else {

                // Read all account files from disk as we need to compare the login data.
                const account = fileIO.readParsed(`./user/profiles/${profileIDs[id]}/account.json`);
                if (info.email === account.email && info.password === account.password) {
                    // Read the file age for this users account file.
                    const stats = fs.statSync(`./user/profiles/${profileIDs[id]}/account.json`);

                    // Save the account to memory and set the accountFileAge variable.
                    this.accounts[profileIDs[id]] = account
                    this.accountFileAge[profileIDs[id]] = stats.mtimeMs;
                    logger.logSuccess(`[CLUSTER] User ${account.email} with ID ${profileIDs[id]} logged in successfully.`);

                    return profileIDs[id];
                }
            }
        }

        // If the account does not exist, this will allow the launcher to display an error message.
        return "";
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

   /**
   * If the sessionID is specified, this function will save the specified account file to disk, if the file wasn't modified elsewhere and the current memory content differs from the content on disk.
   * @param {*} sessionID 
   */
    static saveToDisk(sessionID = 0) {
        // Should all accounts be saved to disk?
        if (sessionID == 0) {
          // Iterate through all cached accounts.
          for (const id in this.accounts) {
            // Check if the file was modified by another cluster member using the file age.
            const stats = fs.statSync(`./user/profiles/${id}/account.json`);
            if (stats.mtimeMs == this.accountFileAge[id]) {
    
              // Check if the memory content differs from the content on disk.
              const currentAccount = this.accounts[id];
              const savedAccount = fileIO.readParsed(`./user/profiles/${id}/account.json`);
              if (JSON.stringify(currentAccount) !== JSON.stringify(savedAccount)) {
                // Save memory content to disk.
                fileIO.write(`./user/profiles/${id}/account.json`, this.accounts[id]);
    
                // Update file age to prevent another reload by this server.
                const stats = fs.statSync(`./user/profiles/${id}/account.json`);
                this.accountFileAge[id] = stats.mtimeMs;
    
                logger.logSuccess(`[CLUSTER] Account file for account ${id} was saved to disk.`);
              }
            } else {
              logger.logWarning(`[CLUSTER] Account file for account ${id} was modified, reloading.`);
    
              // Reload the account from disk.
              this.accounts[id] = fileIO.readParsed(`./user/profiles/${id}/account.json`);
              // Reset the file age for this users account file.
              this.accountFileAge[id] = stats.mtimeMs;
            }
          }
        } else {
          // Does the account file exist? (Required for new accounts)
          if (!fileIO.fileExist(`./user/profiles/${sessionID}/account.json`)) {
            // Save memory content to disk
            fileIO.write(`./user/profiles/${sessionID}/account.json`, this.accounts[sessionID]);
    
            // Update file age to prevent another reload by this server.
            const stats = fs.statSync(`./user/profiles/${sessionID}/account.json`);
            this.accountFileAge[sessionID] = stats.mtimeMs;
    
            logger.logSuccess(`[CLUSTER] New account ${sessionID} registered and was saved to disk.`);
          } else {
            // Check if the file was modified by another cluster member using the file age.
            const stats = fs.statSync(`./user/profiles/${sessionID}/account.json`);
            if (stats.mtimeMs == this.accountFileAge[sessionID]) {
              // Check if the memory content differs from the content on disk.
              const currentAccount = this.accounts[sessionID];
              const savedAccount = fileIO.readParsed(`./user/profiles/${sessionID}/account.json`);
              if (JSON.stringify(currentAccount) !== JSON.stringify(savedAccount)) {
                // Save memory content to disk
                fileIO.write(`./user/profiles/${sessionID}/account.json`, this.accounts[sessionID]);
    
                // Update file age to prevent another reload by this server.
                const stats = fs.statSync(`./user/profiles/${sessionID}/account.json`);
                this.accountFileAge[sessionID] = stats.mtimeMs;
    
                logger.logSuccess(`[CLUSTER] Account file for account ${sessionID} was saved to disk.`);
              }
            } else {
              logger.logWarning(`[CLUSTER] Account file for account ${sessionID} was modified, reloading.`);
    
              // Reload the account from disk.
              this.accounts[sessionID] = fileIO.readParsed(`./user/profiles/${sessionID}/account.json`);
              // Reset the file age for this users account file.
              this.accountFileAge[sessionID] = stats.mtimeMs;
            }
          }
        }
      }


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

    static register(info) {
        // Get existing account from memory or cache a new one.
        let accountID = this.reloadAccountByLogin(info)
        if (accountID) {
          return accountID
        }
    
        accountID = utility.generateNewAccountId();
    
        this.accounts[accountID] = {
          id: accountID,
          email: info.email,
          password: info.password,
          wipe: true,
          edition: info.edition,
        };
    
        this.saveToDisk(accountID);
        return "";
      }

/*
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
    }*/
}

class AccountUtils {



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
        return Account.accounts;
    }

    /**
    * Tries to find account data in loaded account list if not present returns undefined
    * @param {*} sessionID 
    * @returns Account_data
    */
    static find(sessionID) {
        // This needs to be at the top to check for changed accounts.
        const accounts = Account.reloadAccountBySessionID(sessionID);
        for (const accountID in accounts) {
            const account = accounts[accountID];

            if (account.id === sessionID) {
                return account;
            }
        }

        return undefined;
    }

    /**
     * Remove account from memory and disk
     * @param {*} info 
     * @returns 
     */
    static remove(info) {
        const accountID = Account.reloadAccountBySessionID(info);
    
        if (accountID !== "") {
          delete Account.accounts[accountID];
          utility.removeDir(`user/profiles/${accountID}/`);
          //this.saveToDisk();
        }
    
        return accountID;
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
}

module.exports.AccountUtils = AccountUtils;
module.exports.Account = Account;