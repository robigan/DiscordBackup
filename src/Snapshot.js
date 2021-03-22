const FileSystem = require("fs/promises");

module.exports = class Snapshoter {
    constructor(client) {
        this.client = client;
    }

    async createSnapshot(guildID) {
        this.client.guilds.set(guildID, await this.client.escalateGuild(guildID));
        const guild = this.client.guilds.get(guildID);
        const data = {};
        this.client.Intents.get("General") ? data.general = await this.createGuildGeneral(guild) : {};
        this.client.Intents.get("Channels") ? data.channels = guild.channels : {};
        this.client.Intents.get("Roles") ? data.roles = guild.roles : {};
        this.client.Intents.get("Emojis") ? data.emojis = guild.emojis : {};
        this.client.Intents.get("Members") ? data.members = guild.members : {};
        const today = new Date();

        await FileSystem.appendFile(`${process.cwd()}/Snapshots/${guild.name}-${today.getTime()}.json`, JSON.stringify(data), { flag: "ax" }).then(() => console.log("Snapshot successfully created")).catch((err) => console.error(err));

        this.client.UI.mainMenu();
    }
    // ${guildID}/${today.getUTCFullYear()}/${today.getUTCMonth()}/${today.getUTCDate()}/

    async createGuildGeneral(guild) {
        return {
            name: guild.name,
            id: guild.id,
            //owner: guild.owner.user.username,
            ownerID: guild.owner_id
        };
    }
};