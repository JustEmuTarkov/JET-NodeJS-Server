const { default: fastifyCompress } = require('fastify-compress');
const zlib = require("zlib");
const util = require('../../core/util.js');


/**
 * Reformat the response data to be sent to the client as JSON
 * @param {request} request 
 * @returns {object}
 */
function bodyToJson(request) {
    if (request.body != undefined) {
        try {
            const decompressed = request.Req_Decompress(request.body);
            let body = request.body;
            if (decompressed != "")
                body = decompressed;

            body = JSON.parse(body);
            request.jsonBody = body; // save it in request so we can use it later one if needed
            return body;
        } catch { return {}; }
    } else {
        return {};
    }
}

/**
 * Inflate the data (?) no sabemos
 * @param {request} response 
 * @returns {buffer}
 */
function fastifyDecompress(response) {
    return fastifyCompress.inflate(response, function (err, buf) {
        return buf;
    });
}

/**
 * Format the data to bsg format (err, errmsg & data)
 * @param {object} res_data
 * @param {*} res_errmsg
 * @param {null} res_err
 * @returns {object}
 */
function bsgFormat(res_data, res_err, res_errmsg) {
    if (res_err == undefined) res_err = 0;
    if (res_errmsg == undefined) res_errmsg = "";
    return {
        err: res_err,
        errmsg: res_errmsg,
        data: res_data
    };
}

/**
 * Set the header to the reply
 * @param {Reply} reply 
 * @param {string} sessionID 
 */
function headerFormat(reply, sessionID) {
    reply.statusCode = 200;
    reply.headers({
        'Content-Type': 'application/json',
        'Set-Cookie': "PHPSESSID=" + sessionID
    })
}

/**
 * Clear the string (?) no sabemos
 * @param {object} res_data 
 * @returns {string}
 */
function noBodyFormat(res_data) {
    return util.tools.clearString(JSON.stringify(res_data));
}

module.exports = {
    bodyToJson: bodyToJson,
    fastifyDecompress: fastifyDecompress,
    bsgFormat: bsgFormat,
    headerFormat: headerFormat,
    noBodyFormat: noBodyFormat
}