
import { FastifyRequest, FastifyReply } from 'fastify';
import { DashboardService } from '../services/dashboard.service';
import {
  DashboardOverviewResponse,
  SystemsStatusResponse,
  SLAPriorityResponse,
  IncidentsStatsResponse,
  DashboardQuery,
  DashboardErrorCode,
  DashboardError
} from '../types/dashboard';

interface DashboardQuerystring {
  period?: 'daily' | 'weekly' | 'monthly';
  systemIds?: string;
  includeMetrics?: string;
}

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  async getOverview(
    request: FastifyRequest<{ Querystring: DashboardQuerystring }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const overview = await this.dashboardService.getDashboardOverview();
      
      const response: DashboardOverviewResponse = {
        success: true,
        data: overview
      };

      reply.status(200).send(response);
    } catch (error) {
      this.handleError(reply, error as DashboardError);
    }
  }

  async getSystemsStatus(
    request: FastifyRequest<{ Querystring: DashboardQuerystring }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { period, systemIds, includeMetrics } = request.query;
      
      const query: DashboardQuery = {
        period,
        systemIds: systemIds ? systemIds.split(',').filter(id => id.trim()) : undefined,
        includeMetrics: includeMetrics === 'true'
      };

      const systems = await this.dashboardService.getSystemsStatus(query);
      
      const response: SystemsStatusResponse = {
        success: true,
        data: systems,
        meta: {
          total: systems.length,
          active: systems.filter(s => s.status === 'up').length,
          inactive: systems.filter(s => s.status === 'down').length,
          warning: systems.filter(s => s.status === 'warning').length
        }
      };

      reply.status(200).send(response);
    } catch (error) {
      this.handleError(reply, error as DashboardError);
    }
  }

  async getSLAPriority(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const slaPriority = await this.dashboardService.getSLAPriorityStats();
      
      const response: SLAPriorityResponse = {
        success: true,
        data: slaPriority
      };

      reply.status(200).send(response);
    } catch (error) {
      this.handleError(reply, error as DashboardError);
    }
  }

  async getIncidentsStats(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const incidentsStats = await this.dashboardService.getIncidentsStats();
      
      const response: IncidentsStatsResponse = {
        success: true,
        data: incidentsStats
      };

      reply.status(200).send(response);
    } catch (error) {
      this.handleError(reply, error as DashboardError);
    }
  }

  async getCompleteDashboard(
    request: FastifyRequest<{ Querystring: DashboardQuerystring }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { period, systemIds, includeMetrics } = request.query;
      
      const query: DashboardQuery = {
        period,
        systemIds: systemIds ? systemIds.split(',') : undefined,
        includeMetrics: includeMetrics === 'true'
      };

      const dashboardData = await this.dashboardService.getCompleteDashboardData(query);
      
      reply.status(200).send({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      this.handleError(reply, error as DashboardError);
    }
  }

  async getHealthScore(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const healthScore = await this.dashboardService.getSystemsHealthScore();
      
      reply.status(200).send({
        success: true,
        data: {
          healthScore,
          description: this.getHealthDescription(healthScore)
        }
      });
    } catch (error) {
      this.handleError(reply, error as DashboardError);
    }
  }

  private getHealthDescription(score: number): string {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Bom';
    if (score >= 70) return 'Atenção';
    if (score >= 60) return 'Crítico';
    return 'Emergência';
  }

  private handleError(reply: FastifyReply, error: DashboardError): void {
    console.error('Dashboard Controller Error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      details: error.details
    });

    if (error.code) {
      switch (error.code) {
        case DashboardErrorCode.INSUFFICIENT_DATA:
          reply.status(422).send({
            success: false,
            message: error.message,
            code: error.code
          });
          return;
        
        case DashboardErrorCode.SYSTEMS_UNAVAILABLE:
        case DashboardErrorCode.METRICS_UNAVAILABLE:
          reply.status(503).send({
            success: false,
            message: error.message,
            code: error.code
          });
          return;
        
        case DashboardErrorCode.CALCULATION_ERROR:
        default:
          reply.status(500).send({
            success: false,
            message: 'Erro interno do servidor',
            code: 'INTERNAL_SERVER_ERROR'
          });
          return;
      }
    }

    reply.status(500).send({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }

  
}