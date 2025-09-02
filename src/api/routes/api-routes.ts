import { FastifyInstance } from 'fastify';
import { apiController } from '../controllers/api-controller';

export async function apiRoutes(fastify: FastifyInstance) {
    fastify.get('/systems/api/:id', apiController.processApiCheck);
}
