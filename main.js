const Discord = require('discord.js');
const fs = require('fs');
const commands = require('./src/commands');

const config = JSON.parse(fs.readFileSync('./src/config.json', 'utf8'));
const token = process.env.DISCORD_TOKEN;
let client = new Discord.Client();

const cmdmap = {
    addRole: commands.cmd_addRole,
    removeRole: commands.cmd_removeRole,
    clear: commands.cmd_clear,
    dmReddit: commands.cmd_dmReddit,
    help: commands.cmd_help,
    hentai: commands.cmd_hentai,
    meme: commands.cmd_meme,
    nsfw: commands.cmd_nsfw,
    reddit: commands.cmd_reddit,
    say: commands.cmd_say,
    sudo: cmd_sudo
};

async function cmd_sudo(msg, args, sudo) {
    let invoke = args[0],
        arguments = args.slice(1);
        if (arguments.includes(msg.author.id)) {
        arguments = arguments.filter(argument => argument !== msg.author.id);
        sudo = true;
    }
    console.log(`User: "${msg.author.displayName}", ID: "${msg.author.id}", Sudo: "${sudo}", Invoke: "${invoke}", Arguments: "${arguments}"`);
    if (invoke in cmdmap) await cmdmap[invoke](msg, arguments, sudo);
    return sudo;
}

client.on('ready', () => {
    console.log(`Logged in as "${client.user.username}" with ID: "${client.user.id}"`);
    client.user.setActivity("S.N.O.B", { type: 'PLAYING' }).catch(error => console.error(error));
});

client.on('message', (msg) => {
    let cont = msg.content,
        author = msg.author;
    if (author.id !== client.user.id && cont.startsWith(config.prefix) && (msg.channel.type !== "dm" && msg.channel.type !== "Group")) {
        let invoke = cont.split(' ')[0].substr(config.prefix.length),
            arguments = cont.split(' ').slice(1);
        console.log(`User: "${author.username}", ID: "${author.id}", Invoke: "${invoke}", Arguments: "${arguments}"`);
        if (invoke in cmdmap) {
            cmdmap[invoke](msg, arguments, false)
                .then((response) => {
                    if (response && msg.deletable) msg.delete(100).catch(error => console.log(error));
                })
                .catch(error => console.log(error));
        }
    }
});

client.login(token).catch(console.error);