const { Client } = require("discord.js");
const FileSystem = require("fs/promises");

module.exports = class Backer extends Client {
    constructor(...options) {
        super(...options);
        this.UI = new (require("./UI.js"))(this);
        this.Intents = ["Channels", "Roles"];

        this.once("ready", async () => {
            await this.UI.handleReady();
            this.UI.mainMenu();
        });
    }

    async createSnapshot(guildID) {
        const guild = this.guilds.cache.get(guildID);
        const data = {};
        data.channels = guild.channels.cache;
        data.roles = guild.roles.cache;
        data.emojis = guild.emojis.cache;
        const today = new Date();

        await FileSystem.appendFile(`${process.cwd()}/Snapshots/${guild.name}-${today.getTime()}.json`, JSON.stringify(data), { flag: "ax" }).then(() => console.log("Snapshot successfully created")).catch((err) => console.error(err));

        this.UI.mainMenu();
    }
    // ${guildID}/${today.getUTCFullYear()}/${today.getUTCMonth()}/${today.getUTCDate()}/

    async start(token) {
        await this.login(token);
    }
};