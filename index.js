const Options = {
    messageCacheMaxSize: 200,
    messageCacheLifetime: 180,
    messageSweepInterval: 120,
    messageEditHistoryMaxSize: 1,
    http: {
        version: 8
    }
}; // Options that dictate the client, see https://discord.js.org/#/docs/main/stable/typedef/ClientOptions

const Secrets = require("./Configs/Secrets.json");
const Backer = new (require("./src/Client.js"))(Options);

Backer.start(Secrets.token);