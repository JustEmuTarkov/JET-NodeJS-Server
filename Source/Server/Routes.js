class Routes 
{
    constructor(Fastify)
    {
        Fastify.AddRoute("/", function(req, reply) { 
            const body = req.Req_Body2Json(req);
            console.log(body);
            console.log(req.jsonBody);
            reply.ResponseHeader(reply, 12345);
            reply.send(reply.Res_Compress(reply.Res_BSG({ "response": "OK" })));
        }, "get&post");
    }
}
module.exports = Routes;