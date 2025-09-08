// src/routes/dashboard.routes.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { DashboardController } from '../controllers/dashboard.controller';

export async function dashboardRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
): Promise<void> {
  const dashboardController = new DashboardController();


 
  

 
  fastify.get('/dashboard/overview', dashboardController.getOverview.bind(dashboardController));

  
  fastify.get('/dashboard/systems-status', dashboardController.getSystemsStatus.bind(dashboardController));


  fastify.get('/dashboard/sla-priority', 
   dashboardController.getSLAPriority.bind(dashboardController));


  fastify.get('/dashboard/incidents-stats', dashboardController.getIncidentsStats.bind(dashboardController));


  fastify.get('/dashboard/', dashboardController.getCompleteDashboard.bind(dashboardController));


  fastify.get('/dashboard/health', dashboardController.getHealthScore.bind(dashboardController));
}