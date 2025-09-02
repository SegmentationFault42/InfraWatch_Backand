// src/controllers/webhook-controller.ts
/*import { FastifyRequest, FastifyReply } from 'fastify';
import { webhookService } from '../services/webhook-service';

class WebhookController {
    // POST /webhook/systems/:id/incoming - Receber notificação do sistema
    receiveIncomingWebhook = async (
        request: FastifyRequest<{
            Params: { id: string };
            Body: any;
        }>,
        reply: FastifyReply,
    ) => {
        try {
            const { id } = request.params;
            const webhookData = request.body;

            await webhookService.processIncomingWebhook(id, webhookData);

            reply.send({
                success: true,
                message: 'Webhook processado com sucesso',
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            this.handleError(reply, error);
        }
    };

    // GET /webhook/systems/:id/history - Histórico de webhooks recebidos
    getIncomingWebhookHistory = async (
        request: FastifyRequest<{
            Params: { id: string };
            Querystring: { from?: string; to?: string };
        }>,
        reply: FastifyReply,
    ) => {
        try {
            const { id } = request.params;
            const { from, to } = request.query;

            const fromDate = from
                ? new Date(from)
                : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const toDate = to ? new Date(to) : new Date();

            const history = await webhookService.getIncomingWebhookHistory(
                id,
                fromDate,
                toDate,
            );

            reply.send({
                success: true,
                data: {
                    history,
                    count: history.length,
                    period: { from: fromDate, to: toDate },
                },
            });
        } catch (error) {
            this.handleError(reply, error);
        }
    };

    // GET /webhook/systems/:id/status - Status completo do sistema
    getWebhookSystemStatus = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) => {
        try {
            const { id } = request.params;
            const status = await webhookService.getSystemStatus(id);

            reply.send({
                success: true,
                data: status,
            });
        } catch (error) {
            this.handleError(reply, error);
        }
    };

    private handleError(reply: FastifyReply, error: any): void {
        console.error('WEBHOOK Controller Error:', error);

        if (error.message.includes('não encontrado')) {
            reply.status(404).send({
                success: false,
                message: error.message,
            });
            return;
        }

        if (error.message.includes('Campo obrigatório')) {
            reply.status(400).send({
                success: false,
                message: error.message,
            });
            return;
        }

        reply.status(500).send({
            success: false,
            message: 'Erro interno do servidor WEBHOOK',
        });
    }
}

export const webhookController = new WebhookController();*/
