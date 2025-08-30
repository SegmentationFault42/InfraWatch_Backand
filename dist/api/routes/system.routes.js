"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemRoutes = SystemRoutes;
const System_controller_1 = require("../controllers/System.controller");
const system_schema_1 = require("../schema/system.schema");
const verifyJWT_1 = require("../middleware/verifyJWT");
function SystemRoutes(fastify) {
    fastify.post('/hosts/create', { schema: system_schema_1.CreateSystemSwaggerSchema /*preHandler: verifyJWT*/ }, (req, res) => {
        System_controller_1.systemController.addSystem(req, res);
    });
    fastify.get('/hosts', { schema: system_schema_1.GetAllSystemsSwaggerSchema /*preHandler: verifyJWT*/ }, System_controller_1.systemController.getAllSystems);
    fastify.get('/hosts/:id', { schema: system_schema_1.GetSystemByIdSwaggerSchema /*preHandler: verifyJWT */ }, System_controller_1.systemController.getSystemById);
    fastify.delete('/hosts/:id', { schema: system_schema_1.DeleteSystemSwaggerSchema, preHandler: verifyJWT_1.verifyJWT }, System_controller_1.systemController.deleteSystemById);
    fastify.patch('/hosts/:id', { schema: system_schema_1.UpdateSystemSwaggerSchema, preHandler: verifyJWT_1.verifyJWT }, System_controller_1.systemController.updateSystemById);
}
//# sourceMappingURL=system.routes.js.map