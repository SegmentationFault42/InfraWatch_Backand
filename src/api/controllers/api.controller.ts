// src/controllers/api-controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { apiService } from '../services/api-service';

class ApiController {
  // POST /api/systems/:id/test
  testApiConnection = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const result = await apiService.testApiConnection(id);

      reply.send({
        success: true,
        message: 'Teste API executado com sucesso',
        data: result,
      });
    } catch (error) {
      this.handleError(reply, error);
    }
  };

  // POST /api/systems/:id/monitor
  monitorApiSystem = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const result = await apiService.monitorApiSystem(id);

      reply.send({
        success: true,
        message: 'Monitoramento API executado com sucesso',
        data: result,
      });
    } catch (error) {
      this.handleError(reply, error);
    }
  };

  // POST /api/monitor-all
  monitorAllApiSystems = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const results = await apiService.monitorAllApiSystems();
      const total = Object.keys(results).length;
      const up = Object.values(results).filter(r => r.status === 'up').length;
      const down = Object.values(results).filter(r => r.status === 'down').length;
      const warning = Object.values(results).filter(r => r.status === 'warning').length;

      reply.send({
        success: true,
        message: `Monitoramento geral executado: ${up}/${total} APIs ativas`,
        data: {
          results,
          summary: {
            total,
            up,
            down,
            warning,
            uptime_percentage: total > 0 ? Math.round((up / total) * 100) : 0,
          },
        },
      });
    } catch (error) {
      this.handleError(reply, error);
    }
  };

  // GET /api/systems/:id/metrics
  getApiSystemMetrics = async (
    request: FastifyRequest<{
      Params: { id: string };
      Querystring: { from?: string; to?: string; limit?: string };
    }>,
    reply: FastifyReply
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
        metrics = await apiService.getSystemMetrics(id, fromDate, toDate);
      } else {
        const limitNum = limit ? parseInt(limit) : 50;
        metrics = await apiService.getSystemLastMetrics(id, limitNum);
      }

      reply.send({
        success: true,
        data: {
          metrics,
          count: metrics.length,
          period: from || to
            ? {
                from: from
                  ? new Date(from)
                  : new Date(Date.now() - 24 * 60 * 60 * 1000),
                to: to ? new Date(to) : new Date(),
              }
            : undefined,
        },
      });
    } catch (error) {
      this.handleError(reply, error);
    }
  };

  // GET /api/systems/:id/status
  getApiSystemStatus = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const status = await apiService.getSystemStatus(id);

      reply.send({
        success: true,
        data: status,
      });
    } catch (error) {
      this.handleError(reply, error);
    }
  };

  private handleError(reply: FastifyReply, error: any): void {
    console.error('API Controller Error:', error);

    if (error.message.includes('não encontrado')) {
      reply.status(404).send({
        success: false,
        message: error.message,
      });
      return;
    }

    reply.status(500).send({
      success: false,
      message: 'Erro interno do servidor API',
    });
  }
}

export const apiController = new ApiController();