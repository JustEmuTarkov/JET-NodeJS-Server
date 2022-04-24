module.exports = function (request) {
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