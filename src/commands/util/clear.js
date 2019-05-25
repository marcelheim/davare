const Commando = require('discord.js-commando');
const discord = require('discord.js');

module.exports = class ClearCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            group: 'util',
            memberName: 'clear',
            description: 'Clear chat',
            details: 'Deletes n newest messages from chat',
            examples: ['clear 4'],
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
                    key: 'count',
                    prompt: 'Enter number of messages to delete',
                    type: 'integer',
                    parse: (count, msg) => {
                        count = parseInt(count);
                        return (count > 99 ? 99 : count);
                    }
                }
            ]
        });
    }

    async run(msg, args) {
        await msg.channel.fetchMessages({limit: args.count + 1})
            .then(list => list.filter(message => message.id !== msg.id && message.deletable && (msg.channel.type !== "dm" || message.author.bot)))
            .then(list => list.deleteAll())
            .then(() => {if (msg.channel.type !== "dm") msg.delete(3000);})
            .catch((err) => {
                console.error(err);
                msg.reply('Error deleting messages')
                    .then(msg.delete(2000))
                    .catch(console.error);
            })
    }
};