import { Listener } from "discord-akairo";

export class ReadyListener extends Listener {
    public constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
            type: "on"
        });
    }

    public async exec() {
        console.log("Trident is ready.");
    }
}
