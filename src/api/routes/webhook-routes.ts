// src/routes/webhook-routes.ts
/*import { FastifyInstance } from 'fastify';
import { webhookController } from '../controllers/webhook-controller';

export async function webhookRoutes(fastify: FastifyInstance) {
    // Rota principal - Receber dados do sistema externo
    fastify.post(
        '/systems/webhook/:id/incoming',
        {
            schema: {
                tags: ['WEBHOOK'],
                summary: 'Receber notificação de sistema via webhook',
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID do sistema',
                        },
                    },
                },
                body: {
                    type: 'object',
                    additionalProperties: true, // Aceita qualquer estrutura JSON
                },
            },
            config: {
                rateLimit: {
                    max: 100, // Permite muitas requisições por minuto
                    timeWindow: '1 minute',
                },
            },
        },
        webhookController.receiveIncomingWebhook,
    );

    // Rotas auxiliares para consulta
    fastify.get(
        '/systems/webhook/:id/history',
        webhookController.getIncomingWebhookHistory,
    );
    fastify.get(
        '/systems/webhook/:id/status',
        webhookController.getWebhookSystemStatus,
    );
}
*/
