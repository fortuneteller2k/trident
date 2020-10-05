import { Listener } from "discord-akairo";
import { Message, Guild, User } from "discord.js";

class MessageListener extends Listener {
    constructor() {
        super("message", {
            emitter: "client",
            event: "message",
            type: "on"
        });
    }

    exec(msg: Message) {
        const guild: Guild = msg.guild;
        const author: User = msg.author;
        console.log(`[${guild.name}] - <${author.username}#${author.discriminator}> - ${msg.cleanContent}`);
    }
}

module.exports = MessageListener;
