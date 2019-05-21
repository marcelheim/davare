const fetch = require('node-fetch');

module.exports = {
    cmd_say: function (msg, arguments, sudo) {
        if (checkPermissions(["SEND_MESSAGES"], msg, sudo)) {
            if (arguments.length > 0) msg.channel.send(arguments.join(' '));
        }
    },
    cmd_clear: function (msg, arguments, sudo) {
        if (checkPermissions(["MANAGE_MESSAGES"], msg, sudo)) {
            if (arguments[0] > 0) {
                let count = parseInt(arguments[0]) + 1;
                count = count > 100 ? 100 : count;
                msg.channel.fetchMessages({limit: count})
                    .then(function (list) {
                        if (sudo) list.sweep(message => message.id === msg.id);
                        list.deleteAll();
                    })
                    .catch(console.error);
            }
        }
    },
    cmd_reddit: function (msg, arguments, sudo) {
        var sortby = "new", count = 1;
        if (arguments[2] !== undefined) {
            sortby = arguments[1];
            if (arguments[2] > 1 && arguments[2] <= 5) count = parseInt(arguments[2]);
        } else if (arguments[1] > 1 && arguments[1] <= 5) count = parseInt(arguments[1]);
        if (checkPermissions(["SEND_MESSAGES"], msg, sudo)) {
            if (arguments[0] !== undefined) {
                fetch(`https://www.reddit.com/r/${arguments[0]}/${sortby}/.json?limit=100`)
                    .then(function (res) {
                        if (res.ok) return res;
                        else return Promise.reject(new Error("Reddit"));
                    })
                    .then(res => res.json())
                    .then(res => res.data.children)
                    .then(function (res) {
                        if (res.length > 0) return res;
                        else return Promise.reject(new Error("Reddit"))
                    })
                    .then(res => res.map(post => ({
                        author: post.data.author,
                        link: post.data.url,
                        img: post.data.thumbnail,
                        title: post.data.title,
                        subreddit: post.data.subreddit
                    })))
                    .then(res => res.filter(a => a.img.length > 4))
                    .then(res => {
                        for (var i = 0; i < count; i++) {
                            let rand = Math.floor(Math.random() * (res.length - 1));
                            msg.channel.send(`${res[rand].title} - ${res[rand].subreddit}\n${res[rand].link}`);
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        msg.channel.send("Error :slight_frown:");
                    });
            }
        }
    }
};

function checkPermissions(required, msg, sudo) {
    if (sudo) return true;
    else if (msg.member.hasPermission(required)) return msg.member.hasPermission(required);
    else console.log(`ERROR: Permission - User: "${msg.member.displayName}" ID: "${msg.member.id}"`);
}