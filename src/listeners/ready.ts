import { Listener } from "discord-akairo";

class ReadyListener extends Listener {
    constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
            type: "on"
        })
    }

    exec() {
        console.log("Tranquil is ready.");
    }
}

module.exports = ReadyListener;