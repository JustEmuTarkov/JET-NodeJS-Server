const { default: fastCompress } = require('@fastify/compress');
const util = require('../../core/util.js');


/**
 * Reformat the response data to be sent to the client as JSON
 * @param {request} request 
 * @returns {object}
 */
function bodyToJson(request) {
    if (request.body != undefined) {
        try {
            const decompressed = request.fastifyInflate(request.body);
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
function fastInflate(response) {
    return fastCompress.inflate(response, function (err, buf) {
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
function bsgFormat(res_data, res_err, res_errmsg, oneline = false) {
    if (res_err == undefined) res_err = 0;
    if (res_errmsg == undefined) res_errmsg = "";
    const data = {
        err: res_err,
        errmsg: res_errmsg,
        data: res_data
    }
    return (oneline) ? JSON.stringify(data) : JSON.stringify(data, null, "\t");
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
    fastInflate: fastInflate,
    bsgFormat: bsgFormat,
    noBodyFormat: noBodyFormat
}