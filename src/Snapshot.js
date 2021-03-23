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
        this.client.Intents.get("Channels") ? data.channels = guild.channels : undefined;
        this.client.Intents.get("Roles") ? data.roles = guild.roles : undefined;
        this.client.Intents.get("Emojis") ? data.emojis = guild.emojis : undefined;
        this.client.Intents.get("Members") ? data.members = guild.members : undefined;
        this.client.Intents.get("Owner") ? data.owner = guild.owner : undefined;
        this.client.Intents.get("Bans") ? data.bans = guild.bans : undefined;
        const today = new Date();

        await FileSystem.appendFile(`${process.cwd()}/Snapshots/${guild.name}-${today.getTime()}.json`, JSON.stringify(data), { flag: "ax" }).then(() => console.log("Snapshot successfully created")).catch((err) => console.error(err));

        this.client.UI.mainMenu();
    }
    // ${guildID}/${today.getUTCFullYear()}/${today.getUTCMonth()}/${today.getUTCDate()}/s

    async createGuildGeneral(guild) {
        return {
            name: guild.name,
            id: guild.id,
            region: guild.region,
            icon: guild.icon,
            verification_level: guild.verification_level,
            default_message_notifications: guild.default_message_notifications,

            //owner: guild.owner.user.username,
            ownerID: guild.owner_id
        };
    }
};