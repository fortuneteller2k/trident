import { Command } from "discord-akairo";
import { StreamDispatcher } from "discord.js";
import { Message, VoiceConnection } from "discord.js";
import http from "https";
const ytdl = require("ytdl-core-discord");

export const trackList: string[] = [];

export default class PlayCommand extends Command {
    public constructor() {
        super("play", { 
            aliases: ["p", "play"],
            category: "music",
            args: [{
                id: "query",
                type: "string",
                match: "content",
                prompt: {
                    start: () => "Specify YT video to search or YT URL."
                }
            }]
        });
    }

    public exec = async (msg: Message, { query }: { query: string }) => {
        let playing = false;

        if (msg.channel.type === "dm") return;
        const vc = msg.member.voice.channel;

        if (!vc) {
            return msg.reply("Join a VC first!");
        } else {
            const play = async (conn: VoiceConnection , url: string) => {
                let dispatcher: StreamDispatcher;
                if (playing) {
                    trackList.push(url);
                    msg.reply("Added to queue.")
                } else if (!playing && trackList.length > 0) {
                    dispatcher = conn.play(await ytdl(trackList.shift()), { type: "opus" });
                } else {
                    dispatcher = conn.play(await ytdl(url), { type: "opus" });
                }

                dispatcher.on("finish", () => playing = false);
            };

            vc.join().then(vcn => play(vcn, query));
        }
    }
}