module.exports = function (reply, sessionID) {
    reply.statusCode = 200;
    reply.headers({
        'Content-Type': 'application/json',
        'Set-Cookie': "PHPSESSID=" + sessionID
    })
}