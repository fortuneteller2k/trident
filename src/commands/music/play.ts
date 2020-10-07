import { Command } from "discord-akairo";
import { Guild, Message, StreamDispatcher, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";
import ytdld from "ytdl-core-discord";
import ytdlc from "ytdl-core";
import youtubeSearch from "youtube-search";
import * as bYoutubeSearch from "youtube-search-without-api-key";
import { config } from "dotenv";

config({ "path": "../../../../.env" });

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
                dispatcher: StreamDispatcher, 
                tracks: Track[], 
                volume: number, 
                playing: boolean) {
        this.textChannel = textChannel;
        this.voiceChannel = voiceChannel;
        this.connection = connection;
        this.dispatcher = dispatcher;
        this.tracks = tracks;
        this.volume = volume;
        this.playing = playing;
    }
    textChannel: TextChannel;
    voiceChannel: VoiceChannel;
    connection: VoiceConnection;
    dispatcher: StreamDispatcher;
    tracks: Track[];
    volume: number;
    playing: boolean;
}


export default class PlayCommand extends Command {
    public constructor() {
        super("play", { 
            aliases: ["p"],
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

        guildQueue.dispatcher = guildQueue.connection.play(await ytdld(track.url), { type: "opus" })
            .on("finish", () => {
                guildQueue.tracks.shift();
                this.play(guild, guildQueue.tracks[0]);
            })
            .on("error", e => {
                console.error(e)
                guildQueue.voiceChannel.leave();
                guildQueue.textChannel.send("An unrecoverable error occurred.");
             });

        
        guildQueue.dispatcher.setVolumeLogarithmic(guildQueue.volume / 5);
        await guildQueue.textChannel.send(`**Now playing:** ${track.title}`);
    }

    isURL = (str: string) => {
        const urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        const url = new RegExp(urlRegex, 'i');
        return str.length < 2083 && url.test(str);
    }

    processTracks = async (msg: Message, query: string) => {
        const vc = msg.member.voice.channel;
        const guildQueue = queue.get(msg.guild.id);
        const trackInfo = await ytdlc.getInfo(query);
        const track = new Track(trackInfo.videoDetails.title, trackInfo.videoDetails.video_url);

        if (!guildQueue) {
            const queueContract: QueueContract = new QueueContract(<TextChannel>msg.channel, vc, null, null, [], 5, true);
            queue.set(msg.guild.id, queueContract);
    
            queueContract.tracks.push(track);
    
            try {
                queueContract.connection = await vc.join();
                await this.play(msg.guild, queueContract.tracks[0]);
            } catch (e) {
               queue.delete(msg.guild.id);
               return msg.channel.send(e);
            }
        } else {
            guildQueue.tracks.push(track);
             return msg.reply(`**${track.title}** added to the queue.`);
        }
    }

    public exec = async (msg: Message, { query }: { query: string }) => {
        if (this.isURL(query)) return this.processTracks(msg, query);
        else {
            const options: youtubeSearch.YouTubeSearchOptions = {
                maxResults: 1,
                key: process.env.API_KEY
            };

            await youtubeSearch(query, options, async (err, res) => {
                if (err.message.startsWith("Error: Request failed with status code 403")) {
                    const videos = await bYoutubeSearch.search(query);
                    return this.processTracks(msg, `https://www.youtube.com/watch?v=${videos[0].id}`);
                } else return this.processTracks(msg, `https://www.youtube.com/watch?v=${res[0].id}`);
            });
        }
    }
}