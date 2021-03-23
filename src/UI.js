const Prompts = require("prompts");
const Globby = require("globby");
const { bold: Bold, green: Green, grey: Grey, red: Red } = require("kleur");

module.exports = class UI {
    constructor(client) {
        this.client = client;
    }

    async handleReady() {
        console.log(Bold(`${Green("✔")} Logged in as ${Red(await this.client.Rest.user.getSelf().then(d => { return d.username; }))}`));
    }

    async mainMenu() {
        const Action = await Prompts({
            type: "select",
            name: "value",
            message: "Menu",
            choices: [
                { title: "See available servers", description: "Let's you see servers and the possible data to snapshot", value: "ServerInfos" },
                { title: "Pick a server to snapshot", description: "Starts the snapshotting process", value: "Backup" },
                { title: "Restore server from snapshot", description: "Restores/Makes a new server from backup", value: "Restore" },
                { title: "Configure intent options", description: "Configures which intents to snapshot (Options doesn't save!)", value: "Configure" },
                { title: "Exit program", value: "Exit" }
            ],
            initial: 1
        });
        if (Action.value === "Backup") this.client.Snapshot.createSnapshot(await this.pickGuilds(this.client.guilds));
        else if (Action.value === "Restore") /*this.client.Restore.createNewServer*/(await this.pickFile(`${process.cwd()}/Snapshots/*.json`));
        else if (Action.value === "ServerInfos") this.getServerInfo(await this.pickGuilds(this.client.guilds));
        else if (Action.value === "Configure") await this.chooseData();
        else if (Action.value === "Exit") process.exit();
    }

    async getServerInfo(guildID) {
        this.client.guilds.set(guildID, await this.client.escalateGuild(guildID));
        const guild = this.client.guilds.get(guildID);
        const channels = guild.channels ?? "Channel list not downloaded";
        const roles = guild.roles;
        const emojis = guild.emojis;
        const members = guild.members ?? "Member list not downloaded";
        console.log(`${Bold("Name")} ${Grey("›")} ${guild.name}
${Bold("Channels")} ${Grey("›")} ${Array.isArray(channels) ? channels.length : channels}
${Bold("Roles")} ${Grey("›")} ${roles.length}
${Bold("Emojis")} ${Grey("›")} ${emojis.length}
${Bold("Members")} ${Grey("›")} ${Array.isArray(members) ? members.length : members}`);
        this.mainMenu();
    }

    async pickGuilds() {
        const guilds = [];
        this.client.guilds.forEach(guild => {
            if (!guild.unavailable) guilds.push({ title: guild.name, value: guild.id });
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
                { title: "General Information", value: "General", selected: this.client.Intents.get("General"), disabled: true },
                { title: "Channels", value: "Channels", selected: this.client.Intents.get("Channels") },
                { title: "Roles", value: "Roles", selected: this.client.Intents.get("Roles") },
                { title: "Emojis", value: "Emojis", selected: this.client.Intents.get("Emojis") },
                { title: "Members", value: "Members", selected: this.client.Intents.get("Members") },
                { title: "Owner", value: "Owner", selected: this.client.Intents.get("Owner") },
                { title: "Bans", value: "Bans", selected: this.client.Intents.get("Bans") },
            ],
            warn: "This option is either disabled for toggling or not available at the moment"
        });
        for (const Intent of this.client.Intents.keys()) {
            this.client.Intents.set(Intent, false);
        }
        Intents.value.forEach(x => this.client.Intents.set(x, true));
        this.mainMenu();
    }

    async pickFile(Dir) {
        const Files = await Globby(Dir);
        const Options = Files.map(File => ({ title: File, value: File }));
        const File = await Prompts({
            type: "select",
            name: "value",
            message: "Pick snapshot file",
            choices: Options
        });
        this.mainMenu();
        return File.value;
    }
};