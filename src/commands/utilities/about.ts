import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { VERSION } from "../../trident";

export default class AboutCommand extends Command {
    public constructor() {
        super("about", { 
            aliases: ["about"] ,
            category: "utilities"
        });
    }

    public exec = async (msg: Message) => {
        let selfUser = msg.client.user;
        const embed = new MessageEmbed();
        embed.setTitle("Trident")
             .setImage(selfUser.avatarURL())
             .setURL("https://github.com/fortuneteller2k/trident")
             .setDescription("A Discord bot made in TypeScript using `discord-akairo` and `discord.js`.")
             .setFooter(`trident version v${VERSION}`);

        return msg.reply(embed);
    }
}