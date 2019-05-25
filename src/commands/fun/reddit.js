const Commando = require('discord.js-commando');
const extras = require('../../extras.js');
const chance = require('chance')();

module.exports = class RedditCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'reddit',
            group: 'fun',
            memberName: 'reddit',
            throttling: {
                usages: 2,
                duration: 30,
            },
            description: 'Sends random picture from specified subreddit',
            details: 'Sends random picture from specified subreddit',
            examples: ['reddit me_irl new 5', 'reddit dankmemes'],
            args: [
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
                    prompt: 'Enter sortby new/hot/top/rising/controversial)',
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
            rands.forEach(rand => msg.channel.send(`${data[rand].title} - ${data[rand].subreddit}\n${data[rand].link}`).catch(console.error));
        }
        else msg.channel.send("Error :slight_frown:")
            .then(msg => msg.delete(3000))
            .catch(error => console.error(error));
    }
};