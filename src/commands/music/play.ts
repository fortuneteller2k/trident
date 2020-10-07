import { Command } from "discord-akairo";
import { Guild } from "discord.js";
import { StreamDispatcher } from "discord.js";
import { Message, VoiceConnection, TextChannel, VoiceChannel } from "discord.js";
const ytdl = require("ytdl-core-discord");

export const queue: Map<string, QueueContract> = new Map();

class Track {
    title: string;
    url: string;

    constructor(title: string, url: string) {
        this.title = title;
        this.url = url;
    }
}

class QueueContract {
    constructor(textChannel: TextChannel,
                voiceChannel: VoiceChannel, 
                connection: VoiceConnection, 
                tracks: Track[], 
                volume: number, 
                playing: boolean) {
        this.textChannel = textChannel;
        this.voiceChannel = voiceChannel;
        this.connection = connection;
        this.tracks = tracks;
        this.volume = volume;
        this.playing = playing;
    }

    textChannel: TextChannel;
    voiceChannel: VoiceChannel;
    connection: VoiceConnection;
    tracks: Track[];
    volume: number;
    playing: boolean;
}


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

    public condition = (msg: Message) => msg.channel.type !== "dm";

    public play = async (guild: Guild, track: Track) => {
        const guildQueue = queue.get(guild.id);

        if (!track) {
            guildQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }

        const dispatcher = guildQueue.connection.play(await ytdl(track.url))
                                                .on("finish", () => {
                                                    guildQueue.tracks.shift();
                                                    this.play(guild, guildQueue.tracks[0]);
                                                })
                                                .on("error", e => console.error(e));

        dispatcher.setVolumeLogarithmic(guildQueue.volume / 5);
        guildQueue.textChannel.send(`**Now playing:** ${track.title}`);
    }

    public exec = async (msg: Message, { query }: { query: string }) => {
        const vc = msg.member.voice.channel;
        const guildQueue = queue.get(msg.guild.id);

        const trackInfo = await ytdl.getInfo(query);
        const track = new Track(trackInfo.title, trackInfo.video_url);

        if (!guildQueue) {
            const queueContract: QueueContract = new QueueContract(<TextChannel>msg.channel, vc, null, [], 5, true);
            queue.set(msg.guild.id, queueContract);

            queueContract.tracks.push(track);

            try {
                const conn = await vc.join();
                queueContract.connection = conn;
                this.play(msg.guild, queueContract.tracks[0]);
            } catch (e) {
                queue.delete(msg.guild.id);
                return msg.channel.send(e);
            }
        } else {
            guildQueue.tracks.push(track);
            return msg.reply(`*${track.title}* added to the queue.`);
        }
    }
}