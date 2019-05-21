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
    }
};

function checkPermissions(required, msg, sudo) {
    if (sudo) return true;
    else if (msg.member.hasPermission(required)) return msg.member.hasPermission(required);
    else console.log(`ERROR: Permission - User: "${msg.member.displayName}" ID: "${msg.member.id}"`);
}