

class Routes {

    static initializeRoutes(fastify) {
        // test route
        Routes.addRoute(fastify, "/test", testHandler, "GET");
    }

    /**
     * Template function that can add routes to the server dynamically
     * @param {fastify} fastify - fastify server
     * @param {string} route - route to add (ex: /api/v1/user/)
     * @param {function} handler - the function that will be executed when the route is called
     * @param {string} method - the method that will be used to call the route (ex: GET, POST, PUT, DELETE)
     */
    static addRoute(fastify, route, handler, method) {
        fastify.route({
            method: method,
            url: route,
            handler: handler
        });
    }

    /**
     * Mao test route
     * @param {fastify} fastify 
     */
    static maoTestRoute(fastify) {
        fastify.AddRoute("/", function(req, reply) { 
            const body = req.Req_Body2Json(req);
            console.log("body: " + body);
            console.log(req.jsonBody);
            reply.ResponseHeader(reply, 12345);
            reply.send(reply.Res_Compress(reply.Res_BSG({ "response": "OK" })));
        }, "get&post");
    }
}

function testHandler(req, reply) {
    reply.send({France: "baise ouai"});
}


module.exports.testHandler = testHandler;
module.exports = Routes;