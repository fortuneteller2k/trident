import { Command } from "discord-akairo";
import { ClientUser, Message } from "discord.js";

export class StatusCommand extends Command {
    public constructor() {
        super("status", { 
            aliases: ["status"],
            args: [
                {
                    id: "status",
                    type: "string",
                    match: "content",
                    prompt: {
                        start: () => `Specify new status. (\`online\`, \`idle\`, \`invisible\`, \`dnd\`)`
                    }
                }
            ]
        })
    }

    public async exec(msg: Message, { status }) {
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