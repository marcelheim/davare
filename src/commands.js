module.exports = {
    cmd_say: function (msg, arguments, sudo) {
        if(checkPermissions(["SEND_MESSAGES"], msg, sudo)){
            if (arguments.length > 0) msg.channel.send(arguments.join(' '));
        }
    },
    cmd_clear: function (msg, arguments, sudo) {
        
    }
};

function checkPermissions(required, msg, sudo) {
    if(sudo) return true;
    else if(msg.member.hasPermission(required)) return msg.member.hasPermission(required);
    else console.log(`ERROR: Permission - User: "${msg.member.displayName}" ID: "${msg.member.id}"`);
}