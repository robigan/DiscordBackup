const Prompts = require("prompts");
const { bold: Bold, green: Green, grey: Grey } = require("kleur");

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
                { title: "Configure snapshot options", description: "Configures which intents to snapshot (Options doesn't save!)", value: "Configure"},
                { title: "Exit program", value: "Exit"}
            ],
            initial: 1
        });
        if (Action.value === "Backup") this.client.createSnapshot(await this.pickGuilds(this.guilds));
        else if (Action.value === "ServerInfos") this.getServerInfo(await this.pickGuilds(this.guilds));
        else if (Action.value === "Configure") this.client.Intents = await this.chooseData();
        else if (Action.value === "Exit") process.exit();
    }

    async getServerInfo(guildID) {
        const guild = this.guilds.cache.get(guildID);
        const channels = guild.channels.cache;
        const roles = guild.roles.cache;
        const emojis = guild.emojis.cache;
        const members = guild.members.cache;
        console.log(`${Bold("Name")} ${Grey("›")} ${guild.name} (${guild.nameAcronym})
${Bold("Channels")} ${Grey("›")} ${channels.size}
${Bold("Roles")} ${Grey("›")} ${roles.size}
${Bold("Emojis")} ${Grey("›")} ${emojis.size}
${Bold("Members")} ${Grey("›")} ${members.size}`);
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
            warn: "This guild is currently unavailable probably due to server outage",
            initial: 0
        });
        return Response.value;
    }

    async chooseData() {
        const Intents = await Prompts({
            type: "multiselect",
            name: "value",
            message: "Which intents should be saved?",
            choices: [
                { title: "General Information", value: "General", selected: this.client.Intents.find(element => element === "General"), disabled: true },
                { title: "Channels", value: "Channels", selected: this.client.Intents.find(element => element === "Channels")},
                { title: "Roles", value: "Roles", selected: this.client.Intents.find(element => element === "Roles")},
                { title: "Emojis", value: "Emojis", selected: this.client.Intents.find(element => element === "Emojis") },
                { title: "Members", value: "Members", selected: this.client.Intents.find(element => element === "Members"), disabled: true }
            ],
            warn: "This option is either disabled for toggling or not available at the moment"
        });
        this.mainMenu();
        return Intents.value;
    }
};