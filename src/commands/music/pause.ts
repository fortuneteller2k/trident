import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { queue } from "./play";

export default class PauseCommand extends Command {
    public constructor() {
        super("pause", {
            aliases: ["pause"],
            category: "music"
        })
    }

    public exec = async (msg: Message) => {
        const guildQueue = queue.get(msg.guild.id);
        if (guildQueue.dispatcher.paused) guildQueue.dispatcher.resume();
        else guildQueue.dispatcher.pause();
    }
}