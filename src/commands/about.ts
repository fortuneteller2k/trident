import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { VERSION } from "../trident";

class AboutCommand extends Command {
    constructor() {
        super("about", { aliases: ["about"] });
    }

    exec(msg: Message) {
        let selfUser = msg.client.user;
        let embed = new MessageEmbed();
        embed.setTitle("Trident")
             .setImage(selfUser.avatarURL())
             .setURL("https://github.com/fortuneteller2k/trident")
             .setDescription("A Discord bot made in TypeScript using `discord-akairo` and `discord.js`.")
             .setFooter(`trident version v${VERSION}`);

        return msg.reply(embed);
    }
}

module.exports = AboutCommand