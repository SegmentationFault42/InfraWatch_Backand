import { FastifyInstance } from 'fastify';
import { pingController } from '../controllers/ping.controller.ts';
import { pingRouteSchema } from '../schema/ping.schema.ts';
import { verifyJWT } from '../middleware/verifyJWT.ts';

export async function pingRoutes(fastify: FastifyInstance) {
    fastify.get('/ping/:host', {
        schema: pingRouteSchema,
        //preHandler: verifyJWT,
        handler: pingController,
    });
}
