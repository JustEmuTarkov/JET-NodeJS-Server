const fs = require("fs");
const { fileIO } = require("../../core/util.js");
const { logger } = require("../../core/util.js");

const getPath = (sessionID) => `./user/profiles/${sessionID}/dialogue.json`;

class Diaglogue {
    constructor() {
        this.dialogue = {};
        this.dialogueFileAge = {};
    }

    /**
    * Initial load of dialogue file content to memory.
    * @param {*} sessionID 
    */
    initializeDialogue(sessionID) {
        // Check if the profile file exists
        if (!fs.existsSync(getPath(sessionID))) {
            logger.logError(`[CLUSTER] Dialogue file for session ID ${sessionID} not found.`);
            return false;
        }

        // Load saved dialogues from disk
        this.dialogues[sessionID] = fileIO.readParsed(getPath(sessionID));

        // Set the file age for the dialogues save file.
        const stats = fs.statSync(getPath(sessionID));
        this.dialogueFileAge[sessionID] = stats.mtimeMs;

        logger.logSuccess(`[CLUSTER] Loaded dialogues for AID ${sessionID} successfully.`);
    }

    freeFromMemory(sessionID) {
        delete this.dialogues[sessionID];
    }

    /**
   * Reload the dialoge for a specified session from disk, if the file was changed by another server / source.
   * @param {*} sessionID 
   */
    reloadDialogue(sessionID) {
        // Check if the dialogue save file exists
        if (fs.existsSync(getPath(sessionID))) {

            // Compare the file age saved in memory with the file age on disk.
            const stats = fs.statSync(getPath(sessionID));
            if (stats.mtimeMs != this.dialogueFileAge[sessionID]) {

                //Load saved dialogues from disk.
                this.dialogues[sessionID] = fileIO.readParsed(getPath(sessionID));

                // Reset the file age for the sessions dialogues.
                const stats = fs.statSync(getPath(sessionID));
                this.dialogueFileAge[sessionID] = stats.mtimeMs;
                logger.logWarning(`[CLUSTER] Dialogues for AID ${sessionID} were modified elsewhere. Dialogue was reloaded successfully.`)
            }
        }
    }

    saveToDisk(sessionID) {
        // Check if dialogues exist in the server memory.
        if (sessionID in this.dialogues) {
            // Check if the dialogue file exists.
            if (fs.existsSync(getPath(sessionID))) {
                // Check if the file was modified elsewhere.
                const statsPreSave = fs.statSync(getPath(sessionID));
                if (statsPreSave.mtimeMs == this.dialogueFileAge[sessionID]) {

                    // Compare the dialogues from server memory with the ones saved on disk.
                    const currentDialogues = this.dialogues[sessionID];
                    const savedDialogues = fileIO.readParsed(getPath(sessionID));
                    if (JSON.stringify(currentDialogues) !== JSON.stringify(savedDialogues)) {
                        // Save the dialogues stored in memory to disk.
                        fileIO.write(getPath(sessionID), this.dialogues[sessionID]);

                        // Reset the file age for the sessions dialogues.
                        const stats = fs.statSync(getPath(sessionID));
                        this.dialogueFileAge[sessionID] = stats.mtimeMs;
                        logger.logSuccess(`[CLUSTER] Dialogues for AID ${sessionID} was saved.`);
                    }
                } else {
                    //Load saved dialogues from disk.
                    this.dialogues[sessionID] = fileIO.readParsed(getPath(sessionID));

                    // Reset the file age for the sessions dialogues.
                    const stats = fs.statSync(getPath(sessionID));
                    this.dialogueFileAge[sessionID] = stats.mtimeMs;
                    logger.logWarning(`[CLUSTER] Dialogues for AID ${sessionID} were modified elsewhere. Dialogue was reloaded successfully.`)
                }
            } else {
                // Save the dialogues stored in memory to disk.
                fileIO.write(getPath(sessionID), this.dialogues[sessionID]);

                // Reset the file age for the sessions dialogues.
                const stats = fs.statSync(getPath(sessionID));
                this.dialogueFileAge[sessionID] = stats.mtimeMs;
                logger.logSuccess(`[CLUSTER] Dialogues for AID ${sessionID} was created and saved.`);
            }
        }
    }

    /**
    * Set the content of the dialogue on the list tab.
    * @param {*} sessionID
    */
    generateDialogueList(sessionID) {
        // Reload dialogues before continuing.
        this.reloadDialogue(sessionID);

        let data = [];
        for (let dialogueId in this.dialogues[sessionID]) {
            data.push(this.getDialogueInfo(dialogueId, sessionID));
        }

        return `{"err":0,"errmsg":null,"data": ${JSON.stringify(data)}}`;
    }

    /**
     * Get the content of a dialogue.
     * @param {*} dialogueID 
     * @param {*} sessionID 
     * @returns 
     */
    getDialogueInfo(dialogueID, sessionID) {
        const dialogue = this.dialogues[sessionID][dialogueID];
        return {
            _id: dialogueID,
            type: 2, // Type npcTrader.
            message: this.getMessagePreview(dialogue),
            new: dialogue.new,
            attachmentsNew: dialogue.attachmentsNew,
            pinned: dialogue.pinned,
        };
    }

    /**
     * Set the content of the dialogue on the details panel, showing all the messages
     * for the specified dialogue.
     * @param {*} dialogueID 
     * @param {*} sessionID 
     * @returns 
     */
    generateDialogueView(dialogueID, sessionID) {
        // Reload dialogues before continuing.
        this.reloadDialogue(sessionID);

        let dialogue = this.dialogues[sessionID][dialogueID];
        dialogue.new = 0;

        // Set number of new attachments, but ignore those that have expired.
        let attachmentsNew = 0;
        let currDt = Date.now() / 1000;
        for (let message of dialogue.messages) {
            if (message.hasRewards && !message.rewardCollected && currDt < message.dt + message.maxStorageTime) {
                attachmentsNew++;
            }
        }
        dialogue.attachmentsNew = attachmentsNew;

        return JSON.stringify({ err: 0, errmsg: null, data: { messages: this.dialogues[sessionID][dialogueID].messages } });
    }

    /**
     * Add a templated message to the dialogue.
     * @param {*} dialogueID 
     * @param {*} messageContent 
     * @param {*} sessionID 
     * @param {*} rewards 
     */
    addDialogueMessage(dialogueID, messageContent, sessionID, rewards = []) {
        // Reload dialogues before continuing.
        this.reloadDialogue(sessionID);

        if (this.dialogues[sessionID] === undefined) {
            this.initializeDialogue(sessionID);
        }
        let dialogueData = this.dialogues[sessionID];
        let isNewDialogue = !(dialogueID in dialogueData);
        let dialogue = dialogueData[dialogueID];

        if (isNewDialogue) {
            dialogue = {
                _id: dialogueID,
                messages: [],
                pinned: false,
                new: 0,
                attachmentsNew: 0,
            };
            dialogueData[dialogueID] = dialogue;
        }

        dialogue.new += 1;

        // Generate item stash if we have rewards.
        let stashItems = {};

        if (rewards.length > 0) {
            const stashId = utility.generateNewItemId();

            stashItems.stash = stashId;
            stashItems.data = [];

            rewards = helper_f.replaceIDs(null, rewards);

            for (let reward of rewards) {
                if (!reward.hasOwnProperty("slotId") || reward.slotId === "hideout") {
                    reward.parentId = stashId;
                    reward.slotId = "main";
                }
                stashItems.data.push(reward);
            }

            dialogue.attachmentsNew += 1;
        }

        let message = {
            _id: utility.generateNewDialogueId(),
            uid: dialogueID,
            type: messageContent.type,
            dt: Date.now() / 1000,
            templateId: messageContent.templateId,
            text: messageContent.text,
            hasRewards: rewards.length > 0,
            rewardCollected: false,
            items: stashItems,
            maxStorageTime: messageContent.maxStorageTime,
            systemData: messageContent.systemData,
        };

        dialogue.messages.push(message);

        const notificationMessage = notifier_f.createNewMessageNotification(message);
        notifier_f.handler.addToMessageQueue(notificationMessage, sessionID);
    }

    /**
     * Get the preview contents of the last message in a dialogue
     * @param {*} dialogue 
     * @returns 
     */
    getMessagePreview(dialogue) {
        // The last message of the dialogue should be shown on the preview.
        const message = dialogue.messages[dialogue.messages.length - 1];

        return {
            dt: message.dt,
            type: message.type,
            templateId: message.templateId,
            uid: dialogue._id,
        };
    }

    /**
     * Get the item contents for a particular message
     * @param {*} messageId 
     * @param {*} sessionID 
     * @returns 
     */
    getMessageItemContents(messageId, sessionID) {
        // Reload dialogues before continuing.
        this.reloadDialogue(sessionID);

        const dialogueData = this.dialogues[sessionID];

        for (let dialogueId in dialogueData) {
            let messages = dialogueData[dialogueId].messages;

            for (let message of messages) {
                if (message._id === messageId) {
                    const attachmentsNew = this.dialogues[sessionID][dialogueId].attachmentsNew;
                    if (attachmentsNew > 0) {
                        this.dialogues[sessionID][dialogueId].attachmentsNew = attachmentsNew - 1;
                    }
                    message.rewardCollected = true;
                    return message.items.data;
                }
            }
        }

        return [];
    }

    removeDialogue(dialogueId, sessionID) {
        // Reload dialogues before continuing.
        this.reloadDialogue(sessionID);

        delete this.dialogues[sessionID][dialogueId];
    }

    setDialoguePin(dialogueId, shouldPin, sessionID) {
        // Reload dialogues before continuing.
        this.reloadDialogue(sessionID);

        this.dialogues[sessionID][dialogueId].pinned = shouldPin;
    }

    setRead(dialogueIds, sessionID) {
        // Reload dialogues before continuing.
        this.reloadDialogue(sessionID);

        let dialogueData = this.dialogues[sessionID];

        for (let dialogId of dialogueIds) {
            dialogueData[dialogId].new = 0;
            dialogueData[dialogId].attachmentsNew = 0;
        }
    }

    getAllAttachments(dialogueId, sessionID) {
        // Reload dialogues before continuing.
        this.reloadDialogue(sessionID);

        let output = [];
        let timeNow = Date.now() / 1000;

        for (let message of this.dialogues[sessionID][dialogueId].messages) {
            if (timeNow < message.dt + message.maxStorageTime) {
                output.push(message);
            }
        }

        this.dialogues[sessionID][dialogueId].attachmentsNew = 0;
        return { messages: output };
    }

    // deletion of items that has been expired. triggers when updating traders.

    removeExpiredItems(sessionID) {
        // Reload dialogues before continuing.
        this.reloadDialogue(sessionID);

        for (const dialogueId in this.dialogues[sessionID]) {
            for (let message of this.dialogues[sessionID][dialogueId].messages) {
                if (Date.now() / 1000 > message.dt + message.maxStorageTime) {
                    message.items = {};
                }
            }
        }
    }
}
module.exports = new Diaglogue();
