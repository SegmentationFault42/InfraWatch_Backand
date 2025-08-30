import { FastifyRequest, FastifyReply } from 'fastify';
import { snmpservice } from '../services/snmp-service';
import { SnmpError } from '../errors/snmp-errors';

class SnmpController {
   

    // POST /snmp/systems/:id/test
    testSnmpConnection = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) => {
        try {
            const { id } = request.params;
            const result = await snmpservice.testSnmpConnection(id);

            reply.send({
                success: true,
                message: 'Teste SNMP executado com sucesso',
                data: result,
            });
        } catch (error) {
            this.handleError(reply, error);
        }
    };

    // POST /snmp/systems/:id/monitor
    monitorSnmpSystem = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) => {
        try {
            const { id } = request.params;
            const result = await snmpservice.monitorSnmpSystem(id);

            reply.send({
                success: true,
                message: 'Monitoramento SNMP executado com sucesso',
                data: result,
            });
        } catch (error) {
            this.handleError(reply, error);
        }
    };

    // POST /snmp/monitor-all
    monitorAllSnmpSystems = async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        try {
            const results = await snmpservice.monitorAllSnmpSystems();
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


    // GET /snmp/systems/:id/metrics
    getSnmpSystemMetrics = async (
        request: FastifyRequest<{
            Params: { id: string };
            Querystring: { from?: string; to?: string; limit?: string };
        }>,
        reply: FastifyReply,
    ) => {
        try {
            const { id } = request.params;
            const { from, to, limit } = request.query;

            let metrics;

            if (from || to) {
                const fromDate = from
                    ? new Date(from)
                    : new Date(Date.now() - 24 * 60 * 60 * 1000);
                const toDate = to ? new Date(to) : new Date();
                metrics = await snmpservice.getSystemMetrics(
                    id,
                    fromDate,
                    toDate,
                );
            } else {
                const limitNum = limit ? parseInt(limit) : 50;
                metrics = await snmpservice.getSystemLastMetrics(
                    id,
                    limitNum,
                );
            }

            reply.send({
                success: true,
                data: {
                    metrics,
                    count: metrics.length,
                    period:
                        from || to
                            ? {
                                  from: from
                                      ? new Date(from)
                                      : new Date(
                                            Date.now() - 24 * 60 * 60 * 1000,
                                        ),
                                  to: to ? new Date(to) : new Date(),
                              }
                            : undefined,
                },
            });
        } catch (error) {
            this.handleError(reply, error);
        }
    };

    private handleError(reply: FastifyReply, error: any): void {
        console.error('SNMP Controller Error:', error);

        if (error instanceof SnmpError) {
            reply.status(400).send({
                success: false,
                message: error.message,
                code: error.code,
            });
            return;
        }

        if (error.message.includes('não encontrado')) {
            reply.status(404).send({
                success: false,
                message: error.message,
            });
            return;
        }

        reply.status(500).send({
            success: false,
            message: 'Erro interno do servidor SNMP',
        });
    }
}

export const snmpcontroller = new SnmpController()
