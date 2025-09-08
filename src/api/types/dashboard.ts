export interface DashboardOverview {
  systemsActive: {
    total: number;
    active: number;
    inactive: number;
    warning: number;
    trend: number;
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


export interface IncidentsStats {
  resolved: number;
  normal: number;
  critical: number;
  total: number;
  currentMonth: string;
}

export interface DashboardData {
  overview: DashboardOverview;
  systemsStatus: SystemWithMetrics[];
  slaPriority: SLAPriorityStats;
  incidentsStats: IncidentsStats;
  lastUpdated: Date;
}


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

export interface DashboardQuery {
  period?: 'daily' | 'weekly' | 'monthly';
  systemIds?: string[];
  includeMetrics?: boolean;
}

export interface TrendData {
  current: number;
  previous: number;
  percentageChange: number;
}

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