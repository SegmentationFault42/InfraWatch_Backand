import { DashboardRepository } from '../repositories/dashboard.repository';
import {
  DashboardOverview,
  SystemWithMetrics,
  SLAPriorityStats,
  IncidentsStats,
  DashboardData,
  DashboardQuery,
  DashboardErrorCode,
  DashboardError
} from '../types/dashboard';

export class DashboardService {
  private dashboardRepository: DashboardRepository;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const [
        systemsCount,
        systemsTrend,
        alertsCount,
        alertsTrend,
        resolvedIncidents,
        resolvedTrend
      ] = await Promise.all([
        this.dashboardRepository.getSystemsCount(),
        this.dashboardRepository.getSystemsCountTrend(),
        this.dashboardRepository.getAlertsCount(),
        this.dashboardRepository.getAlertsCountTrend(),
        this.dashboardRepository.getResolvedIncidentsCount(),
        this.dashboardRepository.getResolvedIncidentsTrend()
      ]);

      return {
        systemsActive: {
          total: systemsCount.total,
          active: systemsCount.active,
          inactive: systemsCount.inactive,
          warning: systemsCount.warning,
          trend: Math.round(systemsTrend.percentageChange)
        },
        alerts: {
          total: alertsCount.total,
          critical: alertsCount.critical,
          warning: alertsCount.warning,
          info: alertsCount.info,
          pending: alertsCount.pending,
          trend: Math.round(alertsTrend.percentageChange)
        },
        resolvedIncidents: {
          total: resolvedIncidents.total,
          thisMonth: resolvedIncidents.thisMonth,
          trend: Math.round(resolvedTrend.percentageChange)
        }
      };
    } catch (error) {
      throw this.createDashboardError(
        DashboardErrorCode.CALCULATION_ERROR,
        'Erro ao calcular overview do dashboard',
        error
      );
    }
  }

  async getSystemsStatus(query: DashboardQuery = {}): Promise<SystemWithMetrics[]> {
    try {
      let systems = await this.dashboardRepository.getSystemsWithMetrics();

     
      if (query.systemIds && query.systemIds.length > 0) {
        systems = systems.filter(system => 
          query.systemIds!.includes(system.id)
        );
      }

      systems.sort((a, b) => {
        const statusOrder = { 'down': 0, 'warning': 1, 'up': 2, 'unknown': 3 };
        const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
        const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
        return aOrder - bOrder;
      });

      return systems;
    } catch (error) {
      throw this.createDashboardError(
        DashboardErrorCode.SYSTEMS_UNAVAILABLE,
        'Erro ao buscar status dos sistemas',
        error
      );
    }
  }

  async getSLAPriorityStats(): Promise<SLAPriorityStats> {
    try {
      return await this.dashboardRepository.getSLAPriorityStats();
    } catch (error) {
      throw this.createDashboardError(
        DashboardErrorCode.CALCULATION_ERROR,
        'Erro ao calcular estatísticas de SLA por prioridade',
        error
      );
    }
  }

  async getIncidentsStats(): Promise<IncidentsStats> {
    try {
      return await this.dashboardRepository.getIncidentsStats();
    } catch (error) {
      throw this.createDashboardError(
        DashboardErrorCode.CALCULATION_ERROR,
        'Erro ao calcular estatísticas de incidentes',
        error
      );
    }
  }

  async getCompleteDashboardData(query: DashboardQuery = {}): Promise<DashboardData> {
    try {
      const [overview, systemsStatus, slaPriority, incidentsStats] = await Promise.all([
        this.getDashboardOverview(),
        this.getSystemsStatus(query),
        this.getSLAPriorityStats(),
        this.getIncidentsStats()
      ]);

      return {
        overview,
        systemsStatus,
        slaPriority,
        incidentsStats,
        lastUpdated: new Date()
      };
    } catch (error) {
      throw this.createDashboardError(
        DashboardErrorCode.CALCULATION_ERROR,
        'Erro ao montar dados completos do dashboard',
        error
      );
    }
  }

  async getSystemsHealthScore(): Promise<number> {
    try {
      const systems = await this.dashboardRepository.getSystemsWithMetrics();
      if (systems.length === 0) return 0;

      const healthyCount = systems.filter(system => 
        system.status === 'up' && system.statusTrend !== 'down'
      ).length;

      return Math.round((healthyCount / systems.length) * 100);
    } catch (error) {
      throw this.createDashboardError(
        DashboardErrorCode.CALCULATION_ERROR,
        'Erro ao calcular score de saúde dos sistemas',
        error
      );
    }
  }

  async getCriticalSystemsCount(): Promise<number> {
    try {
      const systems = await this.dashboardRepository.getSystemsWithMetrics();
      return systems.filter(system => 
        system.status === 'down' || system.statusTrend === 'down'
      ).length;
    } catch (error) {
      return 0;
    }
  }

  async getAverageResponseTime(): Promise<number | null> {
    try {
      const systems = await this.dashboardRepository.getSystemsWithMetrics();
      const systemsWithMetrics = systems.filter(s => s.lastUpdate);
      
      if (systemsWithMetrics.length === 0) return null;

     
      return null; 
    } catch (error) {
      return null;
    }
  }

  private createDashboardError(
    code: DashboardErrorCode,
    message: string,
    details?: any
  ): DashboardError {
    const error = new Error(message) as DashboardError;
    error.code = code;
    error.details = details;
    return error;
  }


}