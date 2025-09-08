// src/routes/sla.routes.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SLAController } from '../controllers/sla.controller';

export async function slaRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
): Promise<void> {
    const slaController = new SLAController();

   
  

 
    fastify.get(
        '/sla/',
        
           
        slaController.getAllSLAs.bind(slaController),
    );

    
    fastify.get(
        '/sla/:systemId',
     
        slaController.getSLABySystemId.bind(slaController),
    );

   
    fastify.put(
        '/sla/:systemId',
      
        slaController.configureSLA.bind(slaController),
    );

    
    fastify.patch(
        '/sla/:systemId',
       
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
