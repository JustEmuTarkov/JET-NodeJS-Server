const resBSG = require("../decorators/Response_BSG");

class Assort {
    static refreshTraders(url, info, sessionID) {
        let traderID = url.split('/');
        return resBSG(this.getTraderAssort(traderID, sessionID));
    }

    static getTraderAssort(traderID, sessionID) {
        {
            if (traderID === "579dc571d53a0658a154fbec") {
                // Fence
                // Lifetime in seconds
                const fence_assort_lifetime = global._database.gameplay.trading.traderSupply[traderID];

                // Current time in seconds
                const current_time = Math.floor(new Date().getTime() / 1000);

                // Initial Fence generation pass.
                if (this.fence_generated_at === 0 || !this.fence_generated_at) {
                    this.fence_generated_at = current_time;
                    TraderUtils.generateFenceAssort();
                }

                if (this.fence_generated_at + fence_assort_lifetime < current_time) {
                    this.fence_generated_at = current_time;
                    logger.logInfo("We are regenerating Fence's assort.");
                    TraderUtils.generateFenceAssort();
                }
            }

            let baseAssorts = global._database.traders[traderID].assort;

            // Build what we're going to return.
            let assorts = Utils.tools.deepCopy(baseAssorts);

            // Fetch the current trader loyalty level
            const pmcData = profile_f.handler.getPmcProfile(sessionID);
            const TraderLevel = profile_f.getLoyalty(pmcData, traderID);

            if (TraderLevel !== "ragfair") {
                // 1 is min level, 4 is max level
                let questassort = global._database.traders[traderID].questassort;

                for (let key in baseAssorts.loyal_level_items) {
                    let requiredLevel = baseAssorts.loyal_level_items[key];
                    if (requiredLevel > TraderLevel) {
                        assorts = AssortUtils.removeItemFromAssort(assorts, key);
                        continue;
                    }

                    if (
                        key in questassort.started &&
                        quest_f.getQuestStatus(pmcData, questassort.started[key]) !==
                        "Started"
                    ) {
                        assorts = AssortUtils.removeItemFromAssort(assorts, key);
                        continue;
                    }

                    if (
                        key in questassort.success &&
                        quest_f.getQuestStatus(pmcData, questassort.success[key]) !==
                        "Success"
                    ) {
                        assorts = AssortUtils.removeItemFromAssort(assorts, key);
                        continue;
                    }

                    if (
                        key in questassort.fail &&
                        quest_f.getQuestStatus(pmcData, questassort.fail[key]) !== "Fail"
                    ) {
                        assorts = AssortUtils.removeItemFromAssort(assorts, key);
                    }
                }
            }
            return assorts;
        }
    }
}

class AssortUtils {
    static removeItemFromAssort(assort, itemID) {
        let toRemove = helper_f.findAndReturnChildrenByItems(
            assort.items,
            itemID
        );

        delete assort.barter_scheme[itemID];
        delete assort.loyal_level_items[itemID];

        for (let i in toRemove) {
            for (let a in assort.items) {
                if (assort.items[a]._id === toRemove[i]) {
                    assort.items.splice(a, 1);
                }
            }
        }

        return assort;
    }
}