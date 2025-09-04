// src/routes/sla.routes.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SLAController } from '../controllers/sla.controller';

export async function slaRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
): Promise<void> {
    const slaController = new SLAController();

   
  

 
    fastify.get(
        '/',
        
           
        slaController.getAllSLAs.bind(slaController),
    );

    
    fastify.get(
        '/:systemId',
     
        slaController.getSLABySystemId.bind(slaController),
    );

   
    fastify.put(
        '/:systemId',
      
        slaController.configureSLA.bind(slaController),
    );

    
    fastify.patch(
        '/:systemId',
       
        slaController.updateSLA.bind(slaController),
    );

   
    fastify.get(
        '/:systemId/history',
      
        slaController.getSLAHistory.bind(slaController),
    );

  
    fastify.get(
        '/reports/monthly',
        slaController.getMonthlySLAReport.bind(slaController),
    );
}
