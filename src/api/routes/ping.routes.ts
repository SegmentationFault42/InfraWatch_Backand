import { FastifyInstance } from 'fastify';
import { pingController } from '../controllers/ping.controller';
import { pingRouteSchema } from '../schema/ping.schema';
import { verifyJWT } from '../middleware/verifyJWT';

export async function pingRoutes(fastify: FastifyInstance) {
    fastify.get('/ping/:host', {
        schema: pingRouteSchema,
        //preHandler: verifyJWT,
        handler: pingController,
    });
}
