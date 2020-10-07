import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { queue } from "./play"

export default class SkipCommand extends Command {
    public constructor() {
        super("skip", {
            aliases: ["s", "skip"],
            userPermissions: "MANAGE_CHANNELS",
            category: "music"
        })
    }

    public exec = async (msg: Message) => {
        queue.get(msg.guild.id).connection.dispatcher.end();
        msg.reply("Skipped.")
    }
}