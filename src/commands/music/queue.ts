import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { queue } from "./play";

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
        const q = queue.get(msg.guild.id);
        q.tracks.forEach(track => embed.addField(`${(q.tracks.indexOf(track) + 1) == 1 
            ? "Now playing: " 
            : q.tracks.indexOf(track) + 1} ${track.title}`, "", false));
        return msg.reply(embed);
    }
}