import { SLARepository } from '../repositories/sla.repository';
import {
    CreateSLAConfigRequest,
    SLAOverview,
    SLAHistoryItem,
    MonthlySLAReport,
    SLAHistoryQuery,
    MonthlySLAReportQuery,
    SLAStatus,
    SLAErrorCode,
    SLAError,
    SystemPerformance,
    SLAReportItem,
    SLAMetrics,
} from '../types/sla.types';

export class SLAService {
    private slaRepository: SLARepository;

    constructor() {
        this.slaRepository = new SLARepository();
    }

    async getAllSLAs(): Promise<SLAOverview[]> {
        try {
            const slaConfigs = await this.slaRepository.findAllSLAConfigs();
            const currentMonth = this.getCurrentMonthPeriod();

            const slaOverviews = await Promise.all(
                slaConfigs.map(async (config) => {
                    const currentMetrics =
                        await this.slaRepository.calculateCurrentSLA(
                            config.system.id,
                            currentMonth,
                        );

                    return {
                        id: config.id,
                        systemId: config.systemId,
                        systemName: config.system.name,
                        systemHost: config.system.host,
                        systemStatus: config.system.status,
                        uptimeTarget: config.uptimeTarget,
                        maxDowntime: config.maxDowntime ?? undefined,
                        responseTimeTarget: config.responseTimeTarget ?? undefined,
                        monitoringWindow: config.monitoringWindow ?? undefined,
                        currentUptime: currentMetrics.uptimePercentage,
                        status: this.getSLAStatus(
                            config.uptimeTarget,
                            currentMetrics.uptimePercentage,
                        ),
                        timeToBreach: this.calculateTimeToBreach(
                            config.uptimeTarget,
                            currentMetrics,
                        ),
                        downtime: currentMetrics.downtime,
                        totalChecks: currentMetrics.totalChecks,
                        successfulChecks: currentMetrics.successfulChecks,
                        createdAt: config.createdAt,
                        updatedAt: config.updatedAt,
                    };
                }),
            );

            return slaOverviews;
        } catch (error) {
            throw this.createSLAError(
                SLAErrorCode.DATABASE_ERROR,
                'Erro ao buscar SLAs',
                error,
            );
        }
    }

    async getSLABySystemId(systemId: string): Promise<SLAOverview | null> {
        try {
            const systemExists =
                await this.slaRepository.checkSystemExists(systemId);
            if (!systemExists) {
                throw this.createSLAError(
                    SLAErrorCode.SYSTEM_NOT_FOUND,
                    `Sistema ${systemId} não encontrado`,
                );
            }

            const slaConfig =
                await this.slaRepository.findSLAConfigBySystemId(systemId);
            if (!slaConfig) {
                return null;
            }

            const currentMonth = this.getCurrentMonthPeriod();
            const currentMetrics = await this.slaRepository.calculateCurrentSLA(
                systemId,
                currentMonth,
            );

            return {
                id: slaConfig.id,
                systemId: slaConfig.systemId,
                systemName: slaConfig.system.name,
                systemHost: slaConfig.system.host,
                systemStatus: slaConfig.system.status,
                uptimeTarget: slaConfig.uptimeTarget,
                maxDowntime: slaConfig.maxDowntime ?? undefined,
                responseTimeTarget: slaConfig.responseTimeTarget ?? undefined,
                monitoringWindow: slaConfig.monitoringWindow ?? undefined,
                currentUptime: currentMetrics.uptimePercentage,
                status: this.getSLAStatus(
                    slaConfig.uptimeTarget,
                    currentMetrics.uptimePercentage,
                ),
                timeToBreach: this.calculateTimeToBreach(
                    slaConfig.uptimeTarget,
                    currentMetrics,
                ),
                downtime: currentMetrics.downtime,
                totalChecks: currentMetrics.totalChecks,
                successfulChecks: currentMetrics.successfulChecks,
                createdAt: slaConfig.createdAt,
                updatedAt: slaConfig.updatedAt,
            };
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.includes('não encontrado')
            ) {
                throw error;
            }
            throw this.createSLAError(
                SLAErrorCode.DATABASE_ERROR,
                'Erro ao buscar SLA do sistema',
                error,
            );
        }
    }

    async configureSLA(
        systemId: string,
        data: CreateSLAConfigRequest,
    ): Promise<SLAOverview> {
        try {
            this.validateSLAConfig(data);

            const systemExists =
                await this.slaRepository.checkSystemExists(systemId);
            if (!systemExists) {
                throw this.createSLAError(
                    SLAErrorCode.SYSTEM_NOT_FOUND,
                    `Sistema ${systemId} não encontrado`,
                );
            }

            const slaConfig = await this.slaRepository.upsertSLAConfig(
                systemId,
                data,
            );

            const currentMonth = this.getCurrentMonthPeriod();
            const currentMetrics = await this.slaRepository.calculateCurrentSLA(
                systemId,
                currentMonth,
            );

            return {
                id: slaConfig.id,
                systemId: slaConfig.systemId,
                systemName: slaConfig.system.name,
                systemHost: slaConfig.system.host,
                systemStatus: slaConfig.system.status,
                uptimeTarget: slaConfig.uptimeTarget,
                maxDowntime: slaConfig.maxDowntime ?? undefined,
                responseTimeTarget: slaConfig.responseTimeTarget ?? undefined,
                monitoringWindow: slaConfig.monitoringWindow ?? undefined,
                currentUptime: currentMetrics.uptimePercentage,
                status: this.getSLAStatus(
                    slaConfig.uptimeTarget,
                    currentMetrics.uptimePercentage,
                ),
                timeToBreach: this.calculateTimeToBreach(
                    slaConfig.uptimeTarget,
                    currentMetrics,
                ),
                downtime: currentMetrics.downtime,
                totalChecks: currentMetrics.totalChecks,
                successfulChecks: currentMetrics.successfulChecks,
                createdAt: slaConfig.createdAt,
                updatedAt: slaConfig.updatedAt,
            };
        } catch (error) {
            if (
                error instanceof Error &&
                (error.message.includes('não encontrado') ||
                    error.message.includes('deve estar') ||
                    error.message.includes('não pode ser'))
            ) {
                throw error;
            }
            throw this.createSLAError(
                SLAErrorCode.DATABASE_ERROR,
                'Erro ao configurar SLA',
                error,
            );
        }
    }

    async getSLAHistory(query: SLAHistoryQuery): Promise<SLAHistoryItem[]> {
        try {
            const systemExists = await this.slaRepository.checkSystemExists(
                query.systemId,
            );
            if (!systemExists) {
                throw this.createSLAError(
                    SLAErrorCode.SYSTEM_NOT_FOUND,
                    `Sistema ${query.systemId} não encontrado`,
                );
            }

            const reports = await this.slaRepository.findSLAHistory(query);

            return reports.map((report) => ({
                id: report.id,
                systemId: report.systemId,
                systemName: report.system.name,
                periodStart: report.periodStart,
                periodEnd: report.periodEnd,
                uptimePct: report.uptimePct,
                downtime: report.downtime,
                incidents: report.incidents,
                createdAt: report.createdAt,
            }));
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.includes('não encontrado')
            ) {
                throw error;
            }
            throw this.createSLAError(
                SLAErrorCode.DATABASE_ERROR,
                'Erro ao buscar histórico de SLA',
                error,
            );
        }
    }

    async getMonthlySLAReport(
        query: MonthlySLAReportQuery = {},
    ): Promise<MonthlySLAReport> {
        try {
            const reports =
                await this.slaRepository.findMonthlySLAReports(query);

            if (reports.length === 0) {
                return {
                    reportMonth: query.month || new Date(),
                    totalSystems: 0,
                    compliantSystems: 0,
                    atRiskSystems: 0,
                    breachedSystems: 0,
                    averageUptime: 0,
                    totalDowntime: 0,
                    worstPerformer: null,
                    bestPerformer: null,
                    reports: [],
                };
            }

            const DEFAULT_TARGET = 99.9;
            const WARNING_THRESHOLD = 99.0;
            const CRITICAL_THRESHOLD = 98.0;

            const compliantSystems = reports.filter(
                (r) => r.uptimePct >= DEFAULT_TARGET,
            ).length;
            const atRiskSystems = reports.filter(
                (r) =>
                    r.uptimePct >= WARNING_THRESHOLD &&
                    r.uptimePct < DEFAULT_TARGET,
            ).length;
            const breachedSystems = reports.filter(
                (r) => r.uptimePct < CRITICAL_THRESHOLD,
            ).length;

            const averageUptime =
                reports.reduce((sum, r) => sum + r.uptimePct, 0) /
                reports.length;
            const totalDowntime = reports.reduce(
                (sum, r) => sum + r.downtime,
                0,
            );

            const sortedByUptime = [...reports].sort(
                (a, b) => a.uptimePct - b.uptimePct,
            );
const firstReport = sortedByUptime[0];
const worstPerformer: SystemPerformance | null =
    sortedByUptime.length > 0 && firstReport?.system
        ? {
              systemId: firstReport.systemId,
              systemName: firstReport.system.name,
              uptimePercentage: firstReport.uptimePct,
              downtime: firstReport.downtime,
          }
        : null;

            const bestPerformer: SystemPerformance | null =
    sortedByUptime.length > 0
        ? (() => {
              const lastIndex = sortedByUptime.length - 1;
              const bestReport = sortedByUptime[lastIndex];
              return bestReport && bestReport.system
                  ? {
                        systemId: bestReport.systemId,
                        systemName: bestReport.system.name,
                        uptimePercentage: bestReport.uptimePct,
                        downtime: bestReport.downtime,
                    }
                  : null;
          })()
        : null;

            const reportItems: SLAReportItem[] = reports.map((report) => ({
                id: report.id,
                systemId: report.systemId,
                systemName: report.system.name,
                systemHost: report.system.host,
                periodStart: report.periodStart,
                periodEnd: report.periodEnd,
                uptimePct: report.uptimePct,
                downtime: report.downtime,
                incidents: report.incidents,
                status: this.getSLAStatus(DEFAULT_TARGET, report.uptimePct),
                createdAt: report.createdAt,
            }));

            return {
                reportMonth: query.month || new Date(),
                totalSystems: reports.length,
                compliantSystems,
                atRiskSystems,
                breachedSystems,
                averageUptime,
                totalDowntime,
                worstPerformer,
                bestPerformer,
                reports: reportItems,
            };
        } catch (error) {
            throw this.createSLAError(
                SLAErrorCode.DATABASE_ERROR,
                'Erro ao gerar relatório mensal',
                error,
            );
        }
    }

    private getSLAStatus(target: number, current: number): SLAStatus {
        if (current >= target) return SLAStatus.COMPLIANT;
        if (current >= target - 1) return SLAStatus.AT_RISK;
        return SLAStatus.BREACH;
    }

    private calculateTimeToBreach(
        target: number,
        metrics: SLAMetrics,
    ): number | undefined {
        if (metrics.totalChecks === 0 || metrics.uptimePercentage < target) {
            return undefined;
        }

        const currentSuccessful = metrics.successfulChecks;
        const currentTotal = metrics.totalChecks;
        const minSuccessfulNeeded = Math.ceil((target / 100) * currentTotal);

        if (currentSuccessful <= minSuccessfulNeeded) {
            return 0;
        }

        return currentSuccessful - minSuccessfulNeeded;
    }

    private getCurrentMonthPeriod() {
        const now = new Date();
        return {
            start: new Date(now.getFullYear(), now.getMonth(), 1),
            end: now,
        };
    }

    private validateSLAConfig(data: CreateSLAConfigRequest): void {
        if (data.uptimeTarget < 0 || data.uptimeTarget > 100) {
            throw this.createSLAError(
                SLAErrorCode.INVALID_UPTIME_TARGET,
                'Uptime target deve estar entre 0 e 100%',
            );
        }

        if (data.maxDowntime !== undefined && data.maxDowntime < 0) {
            throw this.createSLAError(
                SLAErrorCode.INVALID_DOWNTIME_LIMIT,
                'Max downtime não pode ser negativo',
            );
        }

        if (
            data.responseTimeTarget !== undefined &&
            data.responseTimeTarget < 0
        ) {
            throw this.createSLAError(
                SLAErrorCode.INVALID_DOWNTIME_LIMIT,
                'Response time target não pode ser negativo',
            );
        }
    }

    private createSLAError(
        code: SLAErrorCode,
        message: string,
        details?: any,
    ): SLAError {
        const error = new Error(message) as SLAError;
        error.code = code;
        error.details = details;
        return error;
    }
}
