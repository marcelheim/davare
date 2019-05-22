const fetch = require('node-fetch');
const Discord = require('discord.js');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./src/config.json', 'utf8'));

module.exports = {
    cmd_help: async function (msg, arguments, sudo) {
        if (checkPermissions({permissions: ["SEND_MESSAGES"]}, msg, sudo)) {
            let embed = config.help;
            msg.channel.send({embed}).catch(error => console.error(error));
        }
        return true
    },
    cmd_say: async function (msg, arguments, sudo) {
        if (checkPermissions({permissions: ["SEND_MESSAGES"]}, msg, sudo)) {
            if (arguments.length > 0) msg.channel.send(arguments.join(' ')).catch(console.error);
        }
    },
    cmd_clear: async function (msg, arguments, sudo) {
        if (checkPermissions({permissions: ["SEND_MESSAGES"]}, msg, sudo)) {
            if (parseInt(arguments[0]) > 0) {
                let count = parseInt(arguments[0]) + 1;
                count = count > 100 ? 100 : count;
                msg.channel.fetchMessages({limit: count})
                    .then(function (list) {
                        if (sudo) list.sweep(message => message.id === msg.id);
                        list.forEach(msg => msg.delete(0));
                    })
                    .catch(error => {
                        msg.channel.send("Error :slight_frown:")
                            .then(msg => msg.delete(1000))
                            .catch(console.error);
                    });
            }
        }
    },
    cmd_reddit: async function (msg, arguments, sudo) {
        let sortBy = "new", count = 1;
        if (arguments[2]) {
            sortBy = arguments[1];
            if (((arguments[2] > 1 && arguments[2] <= 5) || sudo) && arguments[2]) count = parseInt(arguments[2]);
        } else if (((arguments[1] > 1 && arguments[1] <= 5) || sudo) && arguments[1]) count = parseInt(arguments[1]);
        if (arguments[0]) {
            let subreddit = arguments[0];
            if (checkPermissions({permissions: ["SEND_MESSAGES"]}, msg, sudo)) {
                let data = await getRedditIMG(msg, {subreddit: subreddit, sortBy: sortBy});
                if (data) for (let i = 0; i < count; i++) {
                    let rand = Math.floor(Math.random() * (data.length - 1));
                    msg.channel.send(`${data[rand].title} - ${data[rand].subreddit}\n${data[rand].link}`)
                        .catch(error => console.error(error));
                }
                else msg.channel.send("Error :slight_frown:")
                    .then(msg => msg.delete(1000))
                    .catch(error => console.error(error));
            }
        }
    },
    cmd_dmReddit: async function (msg, arguments, sudo) {
        let sortBy = "new", count = 1,
            user = msg.mentions.users.first();
        if (arguments[3]) {
            sortBy = arguments[2];
            if (((arguments[3] > 1 && arguments[3] <= 5) || sudo) && arguments[3]) count = parseInt(arguments[3]);
        } else if (((arguments[2] > 1 && arguments[2] <= 5) || sudo) && arguments[2]) count = parseInt(arguments[2]);
        if (arguments[1] && user && msg.member) {
            let subreddit = arguments[1],
                member = msg.guild.member(user);
            if (checkPermissions({permissions: ["SEND_MESSAGES"]}, msg, sudo)) {
                let data = await getRedditIMG(msg, {subreddit: subreddit, sortBy: sortBy});
                if (data) for (let i = 0; i < count; i++) {
                    let rand = Math.floor(Math.random() * (data.length - 1));
                    await member.send(`${data[rand].title} - ${data[rand].subreddit}\n${data[rand].link}`)
                        .catch(error => {
                            console.error(error);
                            msg.channel.send(`Error sending messages to ${member.displayName} :slight_frown:`)
                                .then(msg => msg.delete(2000))
                                .catch(error => console.error(error));
                            i = count;
                        });
                }
                else msg.channel.send("Error :slight_frown:")
                    .then(msg => msg.delete(1000))
                    .catch(error => console.error(error));
            }
        } else msg.channel.send("Error: DM not supported :slight_frown:")
            .then(msg => msg.delete(2000))
            .catch(error => console.error(error));
    },
    cmd_meme: async function (msg, arguments, sudo) {
        if (checkPermissions({permissions: ["SEND_MESSAGES"]}, msg, sudo)) {
            let count = (arguments[0] > 0 && arguments[0] < 5) || sudo ? arguments[0] : 1;
            let data = await getRedditIMG(msg, {subreddit: "dankmemes", sortBy: "hot"});
            if (data) for (let i = 0; i < count; i++){
                let rand = Math.floor(Math.random() * (data.length - 1));
                msg.channel.send(`${data[rand].title}\n${data[rand].link}`)
                    .catch(error => console.error(error));
            }
            else msg.channel.send("Error getting the DANKEST memes :slight_frown:")
                .then(msg => msg.delete(1000))
                .catch(error => console.error(error));
        }
    },
    cmd_nsfw: async function (msg, arguments, sudo) {
        if (checkPermissions({permissions: ["SEND_MESSAGES"]}, msg, sudo)) {
            let count = (arguments[0] > 0 && arguments[0] < 5) || sudo ? arguments[0] : 1;
            let data = await getRedditIMG(msg, {subreddit: "nsfw", sortBy: "hot"});
            if (data) for (let i = 0; i < count; i++){
                let rand = Math.floor(Math.random() * (data.length - 1));
                msg.channel.send(`${data[rand].title}\n${data[rand].link}`)
                    .catch(error => console.error(error));
            }
            else msg.channel.send("Error :slight_frown:")
                .then(msg => msg.delete(1000))
                .catch(error => console.error(error));
        }
    },
    cmd_hentai: async function(msg, arguments, sudo){
        if (checkPermissions({permissions: ["SEND_MESSAGES"]}, msg, sudo)) {
            let count = (arguments[0] > 0 && arguments[0] < 5) || sudo ? arguments[0] : 1;
            let data = await getRedditIMG(msg, {subreddit: "hentai", sortBy: "hot"});
            if (data) for (let i = 0; i < count; i++){
                let rand = Math.floor(Math.random() * (data.length - 1));
                msg.channel.send(`${data[rand].title}\n${data[rand].link}`)
                    .catch(error => console.error(error));
            }
            else msg.channel.send("Error getting Hentais :slight_frown:")
                .then(msg => msg.delete(1000))
                .catch(error => console.error(error));
        }
    },
    cmd_addRole: async function(msg, arguments, sudo){
        let roleName = arguments.splice(1).join(" "),
            user = msg.mentions.users.first();
        if (checkPermissions(["MANAGE_ROLES"], msg, sudo) && roleName.length > 0){
            let role = msg.guild.roles.find(x => x.name === roleName);
                msg.guild.member(user).addRole(role).catch(console.error);
        }
        return true;
    },
    cmd_removeRole: async function(msg, arguments, sudo){
        let roleName = arguments.splice(1).join(" "),
            user = msg.mentions.users.first();
        if (checkPermissions(["MANAGE_ROLES"], msg, sudo) && roleName.length > 0){
            let role = msg.guild.roles.find(x => x.name === roleName);
                msg.guild.member(user).removeRole(role).catch(console.error);
        }
        return true;
    }
};

function checkPermissions(required, msg, sudo) {
    if (sudo) return true;
    else if (msg.member.hasPermission(required.permissions)) return true;
    else console.log(`ERROR: Permission - User: "${msg.member.displayName}" ID: "${msg.member.id}"`);
}

async function getRedditIMG(msg, options) {
    let data = undefined;
    await fetch(`https://www.reddit.com/r/${options.subreddit}/${options.sortBy}/.json?limit=100`)
        .then((res) => {
            if (res.ok) return res;
            else return Promise.reject(new Error("Reddit - 404"));
        })
        .then(res => res.json())
        .then(function (res) {
            if (res.data.children.length > 0) return res;
            else return Promise.reject(new Error("Reddit - No Data"))
        })
        .then(res => res.data.children)
        .then(res => res.map(post => ({
            author: post.data.author,
            link: post.data.url,
            title: post.data.title,
            subreddit: post.data.subreddit,
            post_hint: post.data.post_hint
        })))
        .then(res => res.filter(a => a.post_hint === "image"))
        .then((res) => {
            data = res;
        })
        .catch(error => {
            console.log(error);
            data = undefined;
        });
    return data;
}