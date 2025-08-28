import type { FastifyInstance } from 'fastify';

import statusController from '../controllers/status.controller';
import { getStatusSchema } from '../schema/status.schema';

export default async function statusRoutes(fastify: FastifyInstance) {
    fastify.get(
        '/status',
        { schema: getStatusSchema },
        statusController.getStatus,
    );
}
