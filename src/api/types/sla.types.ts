import { System, SLAConfig, SlaReport } from '@prisma/client';

export interface SystemWithSLA extends System {
    SLAConfig: SLAConfig[];
}

export interface SLAConfigWithSystem extends SLAConfig {
    system: System;
}

export interface SlaReportWithSystem extends SlaReport {
    system: System;
}

export interface CreateSLAConfigRequest {
    uptimeTarget: number;
    maxDowntime?: number;
    responseTimeTarget?: number;
    monitoringWindow?: string;
}

export interface UpdateSLAConfigRequest {
    uptimeTarget?: number;
    maxDowntime?: number;
    responseTimeTarget?: number;
    monitoringWindow?: string;
}

export interface SLAMetrics {
    totalChecks: number;
    successfulChecks: number;
    failedChecks: number;
    uptimePercentage: number;
    downtime: number;
    averageResponseTime?: number;
    lastCheckTime?: Date;
}

export interface SLAOverview {
    id: string;
    systemId: string;
    systemName: string;
    systemHost: string;
    systemStatus: string;
    uptimeTarget: number;
    maxDowntime?: number;
    responseTimeTarget?: number;
    monitoringWindow?: string;
    currentUptime: number;
    status: SLAStatus;
    timeToBreach?: number;
    downtime: number;
    totalChecks: number;
    successfulChecks: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface SLAHistoryItem {
    id: string;
    systemId: string;
    systemName: string;
    periodStart: Date;
    periodEnd: Date;
    uptimePct: number;
    downtime: number;
    incidents: number;
    createdAt: Date;
}

export interface MonthlySLAReport {
    reportMonth: Date;
    totalSystems: number;
    compliantSystems: number;
    atRiskSystems: number;
    breachedSystems: number;
    averageUptime: number;
    totalDowntime: number;
    worstPerformer: SystemPerformance | null;
    bestPerformer: SystemPerformance | null;
    reports: SLAReportItem[];
}

export interface SLAReportItem {
    id: string;
    systemId: string;
    systemName: string;
    systemHost: string;
    periodStart: Date;
    periodEnd: Date;
    uptimePct: number;
    downtime: number;
    incidents: number;
    status: SLAStatus;
    createdAt: Date;
}

export interface SystemPerformance {
    systemId: string;
    systemName: string;
    uptimePercentage: number;
    downtime: number;
}

export interface SLAHistoryQuery {
    systemId: string;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
}

export interface MonthlySLAReportQuery {
    month?: Date;
    year?: number;
    systemIds?: string[];
}


export interface SLAListResponse {
    success: boolean;
    data: SLAOverview[];
    meta: {
        total: number;
        compliant: number;
        atRisk: number;
        breached: number;
    };
}

export interface SLADetailsResponse {
    success: boolean;
    data: SLAOverview | null;
}

export interface SLAHistoryResponse {
    success: boolean;
    data: SLAHistoryItem[];
    meta: {
        total: number;
        hasMore: boolean;
    };
}

export interface MonthlySLAReportResponse {
    success: boolean;
    data: MonthlySLAReport;
}

export interface SLAConfigResponse {
    success: boolean;
    data: SLAOverview;
    message?: string;
}

export enum SLAStatus {
    COMPLIANT = 'compliant',
    AT_RISK = 'at_risk',
    BREACH = 'breach',
    NO_DATA = 'no_data',
}

export enum SLAErrorCode {
    SYSTEM_NOT_FOUND = 'SYSTEM_NOT_FOUND',
    SLA_NOT_CONFIGURED = 'SLA_NOT_CONFIGURED',
    INVALID_UPTIME_TARGET = 'INVALID_UPTIME_TARGET',
    INVALID_DOWNTIME_LIMIT = 'INVALID_DOWNTIME_LIMIT',
    INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
    DATABASE_ERROR = 'DATABASE_ERROR',
}


export interface SLACalculationPeriod {
    start: Date;
    end: Date;
}

export interface SLAError extends Error {
    code: SLAErrorCode;
    details?: any;
}
