import { FastifyInstance } from 'fastify';
import { systemController } from '../controllers/System.controller.ts';
import {
    CreateSystemSwaggerSchema,
    DeleteSystemSwaggerSchema,
    GetAllSystemsSwaggerSchema,
    UpdateSystemSwaggerSchema,
} from '../schema/system.schema.ts';

export function SystemRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/hosts/create',
        { schema: CreateSystemSwaggerSchema },
        systemController.addSystem,
    );
    fastify.get(
        '/hosts',
        { schema: GetAllSystemsSwaggerSchema },
        systemController.getAllSystems,
    );
    fastify.delete(
        '/hosts/:id',
        { schema: DeleteSystemSwaggerSchema },
        systemController.deleteSystemById,
    );
    fastify.patch(
        '/hosts/:id',
        { schema: UpdateSystemSwaggerSchema },
        systemController.updateSystemById,
    );
}
