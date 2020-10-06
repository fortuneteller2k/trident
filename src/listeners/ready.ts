import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
    public constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
            type: "on"
        });
    }

    public exec = async () => console.log("Trident is ready.");
}
