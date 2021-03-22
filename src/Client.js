const SnowTransfer = require("snowtransfer");

module.exports = class Backer {
    constructor(Token) {
        const Rest = new SnowTransfer(Token);
        this.Rest = Rest;

        this.UI = new (require("./UI.js"))(this);
        this.Snapshot = new (require("./Snapshot.js"))(this);
        this.Restore = new (require("./Restorer.js"))(this);
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

    async escalateGuild(guildID) {
        return Object.assign(await this.Rest.guild.getGuild(guildID),
            {channels: await this.Rest.guild.getGuildChannels(guildID)},
        );
    }
};