// src/types/dashboard.types.ts
import { System, alerts } from '@prisma/client';

// Tipos para os cards principais
export interface DashboardOverview {
  systemsActive: {
    total: number;
    active: number;
    inactive: number;
    warning: number;
    trend: number; // percentual de mudança
  };
  alerts: {
    total: number;
    critical: number;
    warning: number;
    info: number;
    pending: number;
    trend: number;
  };
  resolvedIncidents: {
    total: number;
    thisMonth: number;
    trend: number;
  };
}

// Sistema com métricas atuais
export interface SystemWithMetrics {
  id: string;
  name: string;
  host: string;
  status: string;
  cpu?: number | null;
  ram?: number | null;
  gpu?: number | null;
  internet?: string | null;
  statusTrend: 'up' | 'down' | 'stable';
  lastUpdate?: Date;
}

// SLA por nível de prioridade
export interface SLAPriorityStats {
  alta: {
    count: number;
    percentage: number;
  };
  media: {
    count: number;
    percentage: number;
  };
  baixa: {
    count: number;
    percentage: number;
  };
}

// Estatísticas de incidentes
export interface IncidentsStats {
  resolved: number;
  normal: number;
  critical: number;
  total: number;
  currentMonth: string;
}

// Dados completos do dashboard
export interface DashboardData {
  overview: DashboardOverview;
  systemsStatus: SystemWithMetrics[];
  slaPriority: SLAPriorityStats;
  incidentsStats: IncidentsStats;
  lastUpdated: Date;
}

// Respostas da API
export interface DashboardOverviewResponse {
  success: boolean;
  data: DashboardOverview;
}

export interface SystemsStatusResponse {
  success: boolean;
  data: SystemWithMetrics[];
  meta: {
    total: number;
    active: number;
    inactive: number;
    warning: number;
  };
}

export interface SLAPriorityResponse {
  success: boolean;
  data: SLAPriorityStats;
}

export interface IncidentsStatsResponse {
  success: boolean;
  data: IncidentsStats;
}

// Queries e filtros
export interface DashboardQuery {
  period?: 'daily' | 'weekly' | 'monthly';
  systemIds?: string[];
  includeMetrics?: boolean;
}

// Métricas temporais para cálculo de trends
export interface TrendData {
  current: number;
  previous: number;
  percentageChange: number;
}

// Erros específicos do dashboard
export enum DashboardErrorCode {
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  CALCULATION_ERROR = 'CALCULATION_ERROR',
  SYSTEMS_UNAVAILABLE = 'SYSTEMS_UNAVAILABLE',
  METRICS_UNAVAILABLE = 'METRICS_UNAVAILABLE'
}

export interface DashboardError extends Error {
  code: DashboardErrorCode;
  details?: any;
}