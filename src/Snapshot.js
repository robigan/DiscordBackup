const FileSystem = require("fs/promises");

module.exports = class Snapshoter {
    constructor(client) {
        this.client = client;
    }

    async createSnapshot(guildID) {
        const guild = this.client.guilds.get(guildID);
        const data = {};
        this.Intents.find(element => element === "General") ? data.general = await this.createGuildGeneral(guildID) : {};
        this.Intents.find(element => element === "Channels") ? data.channels = guild.channels.cache : {};
        this.Intents.find(element => element === "Roles") ? data.roles = guild.roles.cache : {};
        this.Intents.find(element => element === "Emojis") ? data.emojis = guild.emojis.cache : {};
        this.Intents.find(element => element === "Members") ? data.members = guild.members.cache : {};
        const today = new Date();

        await FileSystem.appendFile(`${process.cwd()}/Snapshots/${guild.name}-${today.getTime()}.json`, JSON.stringify(data), { flag: "ax" }).then(() => console.log("Snapshot successfully created")).catch((err) => console.error(err));

        this.UI.mainMenu();
    }
    // ${guildID}/${today.getUTCFullYear()}/${today.getUTCMonth()}/${today.getUTCDate()}/

    async createGuildGeneral(guildID) {
        const guild = this.client.guilds.get(guildID);
        return {
            name: guild.name,
            id: guild.id,
            //owner: guild.owner.user.username,
            ownerID: guild.owner_id
        };
    }
};