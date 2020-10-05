import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { Message } from "discord.js";
import { config } from "dotenv";
config({ path: "../.env" });

class TridentClient extends AkairoClient {
    commandHandler: CommandHandler
    listenerHandler: ListenerHandler

    constructor() {
        super({ ownerID: "175610330217447424" }, { disableMentions: "everyone" });
        this.commandHandler = new CommandHandler(this, {
            directory: "./commands/",
            prefix: "&",
            argumentDefaults: {
                prompt: {
                    cancelWord: "abort",
                    cancel: (msg: Message) => `${msg.author}, aborted.`,
                    ended: (msg: Message) => `${msg.author}, declined.`,
                    retries: 2,
                    time: 20000,
                    timeout: (msg: Message) => `${msg.author}, timed out.`,
                    modifyRetry: (msg: Message, text: String) => text && `${msg.author}, ${text}\n\nType \"abort\" to abort command.`,
                    modifyStart: (msg: Message, text: String) => text && `${msg.author}, ${text}\n\nType \"abort\" to abort command.`,
                }
            }
        })

        this.listenerHandler = new ListenerHandler(this, {
            directory: "./listeners/"
        })

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }
}

export const VERSION = "1.0.0";
const client = new TridentClient();
client.login(process.env.TOKEN);
