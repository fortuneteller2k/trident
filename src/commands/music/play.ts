import { Command } from "discord-akairo";
import { Message, VoiceConnection } from "discord.js";
import http from "https";
import ytdl from "ytdl-core-discord";

export default class PlayCommand extends Command {
    public constructor() {
        super("play", { 
            aliases: ["p"],
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

    public search = (query: string) => {
        const options = {
            hostname: `http://youtube-scrape.herokuapp.com/api/search?q=${query}&page=1`,
            method: "GET"
        };
        let data;
        const req = http.request(options, res => res.on("data", d => data = d));
        req.on('error', error => console.error(error));
        req.end();

        const json = JSON.parse(data);
        const url: string = json.results[1].video.url;
        
        return url;
    }

    public exec = async (msg: Message, { query }: { query: string }) => {
        if (msg.channel.type === "dm") return;
        const vc = msg.member.voice.channel;

        if (!vc) {
            return msg.reply("Join a VC first!");
        } else {
            let queryURL: string;
            const isValidURL = () => {
                try {
                    new URL(query);
                    queryURL = query;
                    return true;
                } catch {
                    return false;
                }  
            }

            const play = async (conn: VoiceConnection , url: string) => {
                const dispatcher = conn.play(await ytdl(url), { type: "opus" });
                dispatcher.on("finish", () => vc.leave());
            };

            vc.join().then(vcn => {
                if (!isValidURL) {
                    queryURL = this.search(query);
                    play(vcn, queryURL);
                } else play(vcn, queryURL);
            });
        }
    }
}