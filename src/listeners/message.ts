import { Listener } from "discord-akairo";
import { Message, Guild, User } from "discord.js";

export default class MessageListener extends Listener {
    public constructor() {
        super("message", {
            emitter: "client",
            event: "message",
            type: "on"
        });
    }

    public async exec(msg: Message) {
        const guild: Guild = msg.guild;
        const author: User = msg.author;
        console.log(`[${guild.name}] - <${author.username}#${author.discriminator}> - ${msg.cleanContent}`);
    }
}
