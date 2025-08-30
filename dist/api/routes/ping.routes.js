"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingRoutes = pingRoutes;
const ping_controller_1 = require("../controllers/ping.controller");
const ping_schema_1 = require("../schema/ping.schema");
async function pingRoutes(fastify) {
    fastify.get('/ping/:host', {
        schema: ping_schema_1.pingRouteSchema,
        //preHandler: verifyJWT,
        handler: ping_controller_1.pingController,
    });
}
//# sourceMappingURL=ping.routes.js.map