# Description:
A simple tool for backing up discord servers. No coding required, built on NodeJS 12 ~ 14. Backup, Load, Revert and choose Intents

# Configuration/Setup:
Do `git clone https://github.com/robigan/DiscordBackup` at the terminal. Create a file under DiscordBackup > Configs called Secrets.json, insert the code below and fill out your token.
```json
{
    "token": "Your token here"
}
```
Then again at the terminal `cd DiscordBackup`, run `npm install` and finally `node .`.