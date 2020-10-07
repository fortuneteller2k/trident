import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { trackList } from "./play";

export default class QueueCommand extends Command {
    public constructor() {
        super("queue", {
            aliases: ["q", "queue"],
            category: "music"
        })
    }

    public exec = async (msg: Message) => {
        const embed = new MessageEmbed();
        embed.setTitle(`Queue for ${msg.guild.name}`);
        trackList.forEach(track => embed.addField(`${trackList.indexOf(track)}`, `${track}`, false));
        return msg.reply(embed);
    }
}