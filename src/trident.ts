import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { Message } from "discord.js";
import { config } from "dotenv";
import { join } from "path";
config();

export const OWNERS = ["175610330217447424"];
export const VERSION = "1.0.0";

export default class TridentClient extends AkairoClient {
    commandHandler: CommandHandler
    listenerHandler: ListenerHandler

    constructor() {
        super({ ownerID: OWNERS }, { disableMentions: "everyone" });
        this.commandHandler = new CommandHandler(this, {
            directory: join(__dirname, "commands"),
            prefix: "&",
            blockBots: true,
            blockClient: true,
            allowMention: true,
            argumentDefaults: {
                prompt: {
                    cancelWord: "abort",
                    cancel: (msg: Message) => `${msg.author}, aborted.`,
                    ended: (msg: Message) => `${msg.author}, declined.`,
                    retries: 2,
                    time: 20000,
                    timeout: (msg: Message) => `${msg.author}, timed out.`,
                    modifyRetry: (msg: Message, text: String) => 
                        text && `${msg.author}, ${text}\nType \`${this.commandHandler.argumentDefaults.prompt.cancelWord}\` to abort command.`,
                    modifyStart: (msg: Message, text: String) => 
                        text && `${msg.author}, ${text}\nType \`${this.commandHandler.argumentDefaults.prompt.cancelWord}\` to abort command.`,
                }
            }
        });
        this.listenerHandler = new ListenerHandler(this, { directory: join(__dirname, "listeners") })
        this.listenerHandler.loadAll();
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.loadAll();
    }
}

export const tridentClient = new TridentClient();
tridentClient.login(process.env.TOKEN);
