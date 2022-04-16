

class Routes {

    /**
     * Add all needed routes to fastify server
     * @param {fastify} fastify - fastify server
     */
    static initializeRoutes(fastify) {
        // test route
        Routes.addRoute(fastify, "/test", testHandler, "GET");
        Routes.addRoute(fastify, "/testBSG", testHandlerBSG, "GET");
        Routes.addRoute(fastify, "/testBSGCompress", testHandlerBSGCompress, "GET");
    }

    /**
     * Template function that can add routes to the server dynamically
     * @param {fastify} fastify - fastify server
     * @param {string} route - route to add (ex: /api/v1/user/)
     * @param {function} handler - function that will be executed when the route is called
     * @param {string} method - method that will be used to call the route (ex: GET, POST)
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

function testHandlerBSG(req, reply) {
    reply.send(reply.Res_BSG({France: "baise ouai"}));
}

function testHandlerBSGCompress(req, reply) {
    reply.send(reply.Res_Compress(JSON.stringify(reply.Res_BSG({France: "baise ouai"}))));
}


module.exports = Routes;