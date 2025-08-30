// src/routes/ping-routes.ts
import { FastifyInstance } from 'fastify';
import { pingController } from '../controllers/ping-controller';


export async function pingRoutes(fastify: FastifyInstance) {
  // PING Operations
  fastify.post(
    '/systems/ping/:id/test',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    pingController.testPingConnection
  );

  fastify.post(
    '/systems/ping/:id/monitor',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
    },
    pingController.monitorPingSystem
  );

  fastify.post(
    '/systems/ping/monitor-all',
    {
      config: {
        rateLimit: {
          max: 2,
          timeWindow: '1 minute',
        },
      },
    },
    pingController.monitorAllPingSystems
  );

  fastify.get(
    '/systems/ping/:id/metrics',
    pingController.getPingSystemMetrics
  );

  fastify.get(
    '/systems/ping/:id/status',
    pingController.getPingSystemStatus
  );
}