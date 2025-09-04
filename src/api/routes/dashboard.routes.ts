// src/routes/dashboard.routes.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { DashboardController } from '../controllers/dashboard.controller';

export async function dashboardRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  const dashboardController = new DashboardController();


 
  

 
  fastify.get('/overview', dashboardController.getOverview.bind(dashboardController));

  
  fastify.get('/systems-status', dashboardController.getSystemsStatus.bind(dashboardController));


  fastify.get('/sla-priority', 
   dashboardController.getSLAPriority.bind(dashboardController));


  fastify.get('/incidents-stats', dashboardController.getIncidentsStats.bind(dashboardController));


  fastify.get('/', dashboardController.getCompleteDashboard.bind(dashboardController));


  fastify.get('/health', dashboardController.getHealthScore.bind(dashboardController));
}