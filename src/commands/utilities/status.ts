import { Command } from "discord-akairo";
import { ClientUser, Message } from "discord.js";
import { OWNERS } from "../../trident";

export default class StatusCommand extends Command {
    public constructor() {
        super("status", { 
            aliases: ["status"],
            category: "utilities",
            args: [{
                id: "status",
                type: "string",
                match: "content"
            }]
        })
    }

    public condition = (msg: Message) => {
        let isOwner: boolean = false;
        OWNERS.forEach(owner => { if (msg.author.id === owner) isOwner = true; });
        return isOwner;
    }

    public exec = async (msg: Message, { status }: { status: string }) => {
        const selfUser: ClientUser = msg.client.user;

        switch (status) {
            case "online": return selfUser.setStatus("online");
            case "idle": return selfUser.setStatus("idle");
            case "invisible": return selfUser.setStatus("invisible");
            case "dnd": return selfUser.setStatus("dnd");
            default: break;
        }
    }
}