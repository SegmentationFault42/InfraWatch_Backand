import { FastifyInstance } from 'fastify';
import { systemController } from '../controllers/System.controller.ts';
import {
    CreateSystemSwaggerSchema,
    DeleteSystemSwaggerSchema,
    GetAllSystemsSwaggerSchema,
    GetSystemByIdSwaggerSchema,
    UpdateSystemSwaggerSchema,
} from '../schema/system.schema.ts';
import { verifyJWT } from '../middleware/verifyJWT.ts';

export function SystemRoutes(fastify: FastifyInstance) {
    fastify.post('/hosts/create',{ schema: CreateSystemSwaggerSchema, /*preHandler: verifyJWT*/ },(req, res)=>{
        systemController.addSystem(req, res)
    }
    );
    fastify.get(
        '/hosts',
        { schema: GetAllSystemsSwaggerSchema, preHandler: verifyJWT },
        systemController.getAllSystems,
    );
    fastify.get(
        '/hosts/:id',
        { schema: GetSystemByIdSwaggerSchema, preHandler: verifyJWT },
        systemController.getSystemById,
    );
    fastify.delete(
        '/hosts/:id',
        { schema: DeleteSystemSwaggerSchema, preHandler: verifyJWT },
        systemController.deleteSystemById,
    );
    fastify.patch(
        '/hosts/:id',
        { schema: UpdateSystemSwaggerSchema, preHandler: verifyJWT },
        systemController.updateSystemById,
    );
}
