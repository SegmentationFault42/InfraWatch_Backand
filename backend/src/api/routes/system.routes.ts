import { FastifyInstance } from 'fastify';
import { systemController } from '../controllers/System.controller.ts';
import { CreateSystemSwaggerSchema } from '../schema/system.schema.ts';

export function SystemRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/hosts/create',
        { schema: CreateSystemSwaggerSchema },
        systemController.addSystem,
    );
    fastify.get('/hosts', systemController.getAllSystems);
    fastify.delete("/hosts", systemController.deleteSystemById)
}
