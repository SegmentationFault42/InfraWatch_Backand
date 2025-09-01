// src/routes/ping-routes.ts
import { FastifyInstance } from 'fastify';
import { pingController } from '../controllers/ping-controller';


export async function pingRoutes(fastify: FastifyInstance) {
  // PING Operations
  fastify.post(
    '/systems/ping/:id/test',
   
    pingController.testPingConnection
  );

  fastify.post(
    '/systems/ping/:id/monitor',
  
    pingController.monitorPingSystem
  );

  fastify.post(
    '/systems/ping/monitor-all',
 
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