import prisma from '../../config/database';
import { timeseries } from '../../config/database';
import {
  SystemWithMetrics,
  SLAPriorityStats,
  IncidentsStats,
  TrendData,
  DashboardQuery
} from '../types/dashboard';

export class DashboardRepository {

  async getSystemsCount(): Promise<{
    total: number;
    active: number;
    inactive: number;
    warning: number;
  }> {
    const [total, active, inactive, warning] = await Promise.all([
      prisma.system.count(),
      prisma.system.count({ where: { status: 'up' } }),
      prisma.system.count({ where: { status: 'down' } }),
      prisma.system.count({ where: { status: 'warning' } })
    ]);

    return { total, active, inactive, warning };
  }

  async getSystemsCountTrend(daysBack: number = 7): Promise<TrendData> {
    const currentDate = new Date();
    const previousDate = new Date();
    previousDate.setDate(currentDate.getDate() - daysBack);

    // Para trend, precisaríamos de dados históricos na tabela System
    // Como não temos, vamos simular baseado nos dados atuais
    const current = await prisma.system.count();
    
    // Simular variação baseada em logs de auditoria recentes
    const recentSystemChanges = await prisma.audit_logs.count({
      where: {
        object_type: 'system',
        created_at: { gte: previousDate }
      }
    });

    const previous = Math.max(0, current - recentSystemChanges);
    const percentageChange = previous > 0 ? ((current - previous) / previous) * 100 : 0;

    return { current, previous, percentageChange };
  }

  // CONTADORES DE ALERTAS
  async getAlertsCount(): Promise<{
    total: number;
    critical: number;
    warning: number;
    info: number;
    pending: number;
  }> {
    const [total, critical, warning, info, pending] = await Promise.all([
      prisma.alerts.count(),
      prisma.alerts.count({ where: { severity: 'critical' } }),
      prisma.alerts.count({ where: { severity: 'warning' } }),
      prisma.alerts.count({ where: { severity: 'info' } }),
      prisma.alerts.count({ where: { status: 'pending' } })
    ]);

    return { total, critical, warning, info, pending };
  }

  async getAlertsCountTrend(daysBack: number = 7): Promise<TrendData> {
    const currentDate = new Date();
    const previousDate = new Date();
    previousDate.setDate(currentDate.getDate() - daysBack);

    const [current, previous] = await Promise.all([
      prisma.alerts.count({
        where: { created_at: { gte: previousDate } }
      }),
      prisma.alerts.count({
        where: {
          created_at: {
            gte: new Date(previousDate.getTime() - (daysBack * 24 * 60 * 60 * 1000)),
            lt: previousDate
          }
        }
      })
    ]);

    const percentageChange = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    return { current, previous, percentageChange };
  }

  // INCIDENTES RESOLVIDOS
  async getResolvedIncidentsCount(period?: Date): Promise<{
    total: number;
    thisMonth: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, thisMonth] = await Promise.all([
      prisma.alerts.count({ where: { status: 'resolved' } }),
      prisma.alerts.count({
        where: {
          status: 'resolved',
          resolved_at: { gte: startOfMonth }
        }
      })
    ]);

    return { total, thisMonth };
  }

  async getResolvedIncidentsTrend(): Promise<TrendData> {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [current, previous] = await Promise.all([
      prisma.alerts.count({
        where: {
          status: 'resolved',
          resolved_at: { gte: thisMonth }
        }
      }),
      prisma.alerts.count({
        where: {
          status: 'resolved',
          resolved_at: { gte: lastMonth, lte: lastMonthEnd }
        }
      })
    ]);

    const percentageChange = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    return { current, previous, percentageChange };
  }

  // SISTEMAS COM MÉTRICAS
  async getSystemsWithMetrics(): Promise<SystemWithMetrics[]> {
    const systems = await prisma.system.findMany({
      select: {
        id: true,
        name: true,
        host: true,
        status: true
      }
    });

    const systemsWithMetrics = await Promise.all(
      systems.map(async (system) => {
        const metrics = await this.getLatestSystemMetrics(system.id);
        
        return {
          id: system.id,
          name: system.name,
          host: system.host,
          status: system.status,
          cpu: metrics?.cpu || null,
          ram: metrics?.memory || null,
          gpu: metrics?.gpu || null,
          internet: metrics?.networkSpeed || null,
          statusTrend: this.determineStatusTrend(system.status, metrics),
          lastUpdate: metrics?.lastUpdate
        };
      })
    );

    return systemsWithMetrics;
  }

  async getLatestSystemMetrics(systemId: string): Promise<{
    cpu?: number;
    memory?: number;
    gpu?: number;
    networkSpeed?: string;
    lastUpdate: Date;
  } | null> {
    try {
      // Buscar métricas mais recentes (SNMP tem mais dados)
      const [snmpMetric, apiMetric] = await Promise.all([
        timeseries.snmpMetrics.findFirst({
          where: { deviceId: systemId },
          orderBy: { time: 'desc' }
        }),
        timeseries.apiMetrics.findFirst({
          where: { deviceId: systemId },
          orderBy: { time: 'desc' }
        })
      ]);

      if (snmpMetric) {
        return {
          cpu: snmpMetric.cpu || undefined,
          memory: snmpMetric.memory || undefined,
          gpu: undefined, // Não disponível no schema atual
          networkSpeed: this.formatNetworkSpeed(snmpMetric.inOctets, snmpMetric.outOctets),
          lastUpdate: snmpMetric.time
        };
      }

      if (apiMetric) {
        return {
          cpu: undefined,
          memory: undefined,
          gpu: undefined,
          networkSpeed: undefined,
          lastUpdate: apiMetric.time
        };
      }

      return null;
    } catch (error) {
      console.error(`Erro ao buscar métricas para sistema ${systemId}:`, error);
      return null;
    }
  }

  async getSLAPriorityStats(): Promise<SLAPriorityStats> {
    const slaConfigs = await prisma.sLAConfig.findMany({
      select: { uptimeTarget: true }
    });

    const total = slaConfigs.length;
    let alta = 0, media = 0, baixa = 0;

    slaConfigs.forEach(config => {
      if (config.uptimeTarget >= 99.9) alta++;
      else if (config.uptimeTarget >= 99.0) media++;
      else baixa++;
    });

    return {
      alta: {
        count: alta,
        percentage: total > 0 ? Math.round((alta / total) * 100) : 0
      },
      media: {
        count: media,
        percentage: total > 0 ? Math.round((media / total) * 100) : 0
      },
      baixa: {
        count: baixa,
        percentage: total > 0 ? Math.round((baixa / total) * 100) : 0
      }
    };
  }

  // ESTATÍSTICAS DE INCIDENTES
  async getIncidentsStats(): Promise<IncidentsStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [resolved, normal, critical, total] = await Promise.all([
      prisma.alerts.count({
        where: {
          status: 'resolved',
          created_at: { gte: startOfMonth }
        }
      }),
      prisma.alerts.count({
        where: {
          severity: 'info',
          created_at: { gte: startOfMonth }
        }
      }),
      prisma.alerts.count({
        where: {
          severity: 'critical',
          created_at: { gte: startOfMonth }
        }
      }),
      prisma.alerts.count({
        where: { created_at: { gte: startOfMonth } }
      })
    ]);

    return {
      resolved,
      normal,
      critical,
      total,
      currentMonth: now.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
    };
  }

  // MÉTODOS AUXILIARES
  private determineStatusTrend(
    systemStatus: string, 
    metrics: any
  ): 'up' | 'down' | 'stable' {
    if (systemStatus === 'down') return 'down';
    if (systemStatus === 'up') {
      if (metrics && (metrics.cpu && metrics.cpu > 90 || metrics.memory && metrics.memory > 90)) {
        return 'down';
      }
      return 'up';
    }
    return 'stable';
  }

  private formatNetworkSpeed(
    inOctets: bigint | null, 
    outOctets: bigint | null
  ): string | undefined {
    if (!inOctets && !outOctets) return undefined;
    
    const totalBytes = Number(inOctets || 0) + Number(outOctets || 0);
    const mbps = Math.round(totalBytes / 1024 / 1024 * 8);
    
    return `${mbps}mb/s`;
  }

  // src/repositories/dashboard.repository.ts
async getAverageResponseTime(daysBack: number = 30): Promise<number | null> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const result = await timeseries.apiMetrics.aggregate({
      where: {
        time: { gte: startDate },
        responseTimeMs: { not: null }
      },
      _avg: {
        responseTimeMs: true
      }
    });

    return result._avg.responseTimeMs ? Math.round(result._avg.responseTimeMs) : null;
  } catch (error) {
    console.error('Erro ao calcular response time médio:', error);
    return null;
  }
}
}