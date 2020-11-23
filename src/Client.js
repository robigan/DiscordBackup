const { Client } = require("discord.js");
const FileSystem = require("fs/promises");

module.exports = class Backer extends Client {
    constructor(...options) {
        super(...options);
        this.UI = new (require("./UI.js"))(this);
        this.Intents = ["General", "Channels", "Roles"];

        this.once("ready", async () => {
            await this.UI.handleReady();
            this.UI.mainMenu();
        });
    }

    async createSnapshot(guildID) {
        const guild = this.guilds.cache.get(guildID);
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

    async start(token) {
        await this.login(token);
    }
};