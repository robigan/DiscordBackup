const SnowTransfer = require("snowtransfer");

const FileSystem = require("fs/promises");

module.exports = class Backer {
    constructor(Token) {
        const Rest = new SnowTransfer(Token);
        this.Rest = Rest;

        this.UI = new (require("./UI.js"))(this);
        this.Intents = ["General", "Channels", "Roles"];

        this.guilds = new Map();

        (async () => {
            for (const guildID of (await this.Rest.user.getGuilds()).map(guild => guild.id)) {
                this.guilds.set(guildID, await this.escalateGuild(guildID));
            }
            await this.UI.handleReady();
            this.UI.mainMenu();
        })().catch(console.error);
    }

    async createSnapshot(guildID) {
        const guild = this.guilds.get(guildID);
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
        const guild = this.guilds.cache.get(guildID);
        return {
            name: guild.name,
            acronym: guild.nameAcronym,
            id: guild.id,
            owner: guild.owner.user.username,
            ownerID: guild.ownerID
        };
    }

    async escalateGuild(guildID) {
        return Object.assign(await this.Rest.guild.getGuild(guildID), 
            {channels: await this.Rest.guild.getGuildChannels(guildID)},
        );
    }
};