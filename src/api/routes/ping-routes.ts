import { FastifyInstance } from 'fastify';
import { pingController } from '../controllers/ping-controller';

export async function pingRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/systems/ping/:id/test',

        pingController.testPingConnection,
    );

    fastify.get(
        '/systems/ping/:id/monitor',

        pingController.monitorPingSystem,
    );

    fastify.post(
        '/systems/ping/monitor-all',

        pingController.monitorAllPingSystems,
    );
}
