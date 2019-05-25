const Commando = require('discord.js-commando');
const extras = require('../../extras');
const chance = require('chance')();

module.exports = class DMRedditCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'dmreddit',
            group: 'fun',
            memberName: 'dmreddit',
            aliases: ['dm-reddit', 'dm_reddit'],
            throttling: {
                usages: 1,
                duration: 60,
            },
            description: 'Sends picture from subreddit to user',
            details: 'Sends random picture from specified subreddit to user',
            examples: ['dmreddit @Aether me_irl 5 new'],
            guildOnly: true,
            args: [
                {
                    key: 'user',
                    prompt: 'Enter user',
                    type: 'user'
                },
                {
                    key: 'subreddit',
                    prompt: 'Enter subreddit',
                    type: 'string'
                },
                {
                    key: 'count',
                    prompt: 'Enter count',
                    type: 'integer',
                    default: 1,
                    parse: (count, msg) => {
                        count = (count <= 5 || client.owners.includes(msg.author) ? count : 5);
                        return count;
                    }
                },
                {
                    key: 'sortby',
                    prompt: 'Enter sortby new/hot/top/rising/controversial))',
                    type: 'string',
                    oneOf: ['new', 'rising', 'hot', 'controversial', 'top'],
                    default: 'new'
                },
            ]
        });
    }

    async run(msg, args) {
        let data = await extras.getReddit(args);
        if (data && data.length > 1) {
            let rands = chance.unique(chance.integer, (args.count > data.length ? data.length : args.count), {min: 0, max: data.length-1});
            await rands.forEach((rand) => {msg.guild.member(args.user).send(`${data[rand].title} - ${data[rand].subreddit}\n${data[rand].link}`).catch(console.error)});
            msg.channel.send(`Sent ${(args.count > data.length ? data.length : args.count)} images`)
                .then(msg => msg.delete(3000))
                .catch(error => console.error(error));
        }
        else msg.channel.send("Error :slight_frown:")
            .then(msg => msg.delete(3000))
            .catch(error => console.error(error));
    }
};