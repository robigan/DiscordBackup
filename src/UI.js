const Prompts = require("prompts");
const { bold: Bold, green: Green } = require("kleur");

module.exports = class UI {
    constructor(client) {
        this.client = client;
    }

    async handleReady() {
        console.log(Bold(`${Green("✔")} Logged in as ${this.client.user.username}`));
        this.guilds = this.client.guilds;
    }

    async mainMenu() {
        const Action = await Prompts({
            type: "select",
            name: "value",
            message: "Menu",
            choices: [
                { title: "See available servers", description: "Let's you see servers and the possible data to snapshot", value: "ServerInfos" },
                { title: "Pick a server to snapshot", description: "Starts the snapshotting process", value: "Backup"},
                { title: "Exit program", value: "Exit"}
            ],
            initial: 0
        });
        if (Action.value === "Backup") this.client.createSnapshot(await this.pickGuilds(this.guilds));
        else if (Action.value === "ServerInfos") this.getServerInfo(await this.pickGuilds(this.guilds));
        else if (Action.value === "Exit") process.exit();
    }

    async getServerInfo(guildID) {
        const guild = this.guilds.cache.get(guildID);
        const channels = guild.channels.cache;
        const roles = guild.roles.cache;
        const emojis = guild.emojis.cache;
        console.log(`${Bold("Name")} › ${guild.name} (${guild.nameAcronym})
${Bold("Channels")} › ${channels.size}
${Bold("Roles")} › ${roles.size}
${Bold("Emojis")} › ${emojis.size}`);
        this.mainMenu();
    }

    async pickGuilds(guildManager) {
        const guilds = [];
        guildManager.cache.map(guild => {
            if (guild.available) guilds.push({ title: guild.name, value: guild.id });
            else guilds.push({ title: guild.name, value: guild.id, disabled: true });
        });
        const Response = await Prompts({
            type: "select",
            name: "value",
            message: "Pick a Guild below to choose from",
            choices: guilds,
            hint: "Where you choose the guild that you would like to snapshot",
            warn: "This guild is currently unavailable probably due to server outage"
        });
        return Response.value;
    }
};