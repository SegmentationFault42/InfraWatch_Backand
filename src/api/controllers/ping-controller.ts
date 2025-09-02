// src/controllers/ping-controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { pingService } from '../services/ping-service';

class PingController {
    // POST /ping/systems/:id/test
    testPingConnection = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) => {
        try {
            const { id } = request.params;
            const result = await pingService.testPingConnection(id);

            reply.send({
                success: true,
                message: 'Teste PING executado com sucesso',
                data: result,
            });
        } catch (error) {
            this.handleError(reply, error);
        }
    };

    // POST /ping/systems/:id/monitor
    monitorPingSystem = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) => {
        try {
            const { id } = request.params;
            const result = await pingService.monitorPingSystem(id);

            reply.send({
                success: true,
                message: 'Monitoramento PING executado com sucesso',
                data: result,
            });
        } catch (error) {
            this.handleError(reply, error);
        }
    };

    monitorAllPingSystems = async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        try {
            const results = await pingService.monitorAllPingSystems();
            const total = Object.keys(results).length;
            const up = Object.values(results).filter(
                (r) => r.status === 'up',
            ).length;
            const down = Object.values(results).filter(
                (r) => r.status === 'down',
            ).length;
            const warning = Object.values(results).filter(
                (r) => r.status === 'warning',
            ).length;

            reply.send({
                success: true,
                message: `Monitoramento geral executado: ${up}/${total} sistemas ativos`,
                data: {
                    results,
                    summary: {
                        total,
                        up,
                        down,
                        warning,
                        uptime_percentage:
                            total > 0 ? Math.round((up / total) * 100) : 0,
                    },
                },
            });
        } catch (error) {
            this.handleError(reply, error);
        }
    };

    private handleError(reply: FastifyReply, error: any): void {
        console.error('PING Controller Error:', error);

        if (error.message.includes('não encontrado')) {
            reply.status(404).send({
                success: false,
                message: error.message,
            });
            return;
        }

        reply.status(500).send({
            success: false,
            message: 'Erro interno do servidor PING',
        });
    }
}

export const pingController = new PingController();
