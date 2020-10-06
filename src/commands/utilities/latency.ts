import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class LatencyCommand extends Command {
    public constructor() {
        super("latency", { 
            aliases: ["ping"],
            category: "utilities"
        });
    }

    public exec = async (msg: Message) => msg.channel.send("Pinging...").then(pm => {
        const restPing = pm.createdTimestamp - msg.createdTimestamp;
        const embed = new MessageEmbed();
        embed.setTitle("")
             .addField("⌚ WebSocket:", `${msg.client.ws.ping}ms`, false)
             .addField("⏰ REST:", `${restPing}ms`, false);
        msg.reply(embed);
        pm.delete();
    });
}