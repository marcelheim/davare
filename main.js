const Discord = require('discord.js');
const fs = require('fs');
const commands = require('./src/commands');

const config = JSON.parse(fs.readFileSync('./src/config.json', 'utf8'));
const token = JSON.parse(fs.readFileSync('./src/token.json', 'utf8'));
let client = new Discord.Client();

const cmdmap = {
    clear: commands.cmd_clear,
    reddit: commands.cmd_reddit,
    say: commands.cmd_say,
    sudo: cmd_sudo
};

function cmd_sudo(msg, args, sudo) {
    let invoke = args[0],
        arguments = args.slice(1);
    if (arguments.includes(msg.member.id)) {
        arguments = arguments.filter(argument => argument !== msg.member.id);
        sudo = true;
    }
    console.log(`User: "${msg.member.displayName}", ID: "${msg.member.id}", Sudo: "${sudo}", Invoke: "${invoke}", Arguments: "${arguments}"`);
    if (invoke in cmdmap) cmdmap[invoke](msg, arguments, sudo);
    return sudo;
}

client.on('ready', () => {
    console.log(`Logged in as "${client.user.username}" with ID: "${client.user.id}"`);
});

client.on('message', (msg) => {
    let cont = msg.content,
        author = msg.member;
    if (author.id !== client.user.id && cont.startsWith(config.prefix)) {
        let invoke = cont.split(' ')[0].substr(config.prefix.length),
            arguments = cont.split(' ').slice(1);
        console.log(`User: "${author.displayName}", ID: "${author.id}", Invoke: "${invoke}", Arguments: "${arguments}"`);
        if (invoke in cmdmap) {
            if (cmdmap[invoke](msg, arguments, false) && msg.deletable) msg.delete();
        }
    }
});

client.login(token.token);