import prisma from '../../config/database';
import { TimeseriesDB } from '../../config/database';
import { pingResult } from '../../ping/ping.config';
import { PingMetrics } from '../types/ping-types';
import {
    CreateSLAConfigRequest,
    SLAMetrics,
    SLAHistoryQuery,
    MonthlySLAReportQuery,
    SLACalculationPeriod,
    SLAConfigWithSystem,
    SlaReportWithSystem,
} from '../types/sla.types';

export class SLARepository {

    async findAllSLAConfigs(): Promise<SLAConfigWithSystem[]> {
        return prisma.sLAConfig.findMany({
            include: {
                system: true,
            },
        });
    }

    async findSLAConfigBySystemId(
        systemId: string,
    ): Promise<SLAConfigWithSystem | null> {
        return prisma.sLAConfig.findFirst({
            where: { systemId },
            include: {
                system: true,
            },
        });
    }

    async upsertSLAConfig(
        systemId: string,
        data: CreateSLAConfigRequest,
    ): Promise<SLAConfigWithSystem> {
        return await  prisma.sLAConfig.upsert({
            where: { systemId },
            update: {
                uptimeTarget: data.uptimeTarget,
                maxDowntime: data.maxDowntime,
                responseTimeTarget: data.responseTimeTarget,
                monitoringWindow: data.monitoringWindow,
                updatedAt: new Date(),
            },
            create: {
                systemId,
                uptimeTarget: data.uptimeTarget,
                maxDowntime: data.maxDowntime,
                responseTimeTarget: data.responseTimeTarget,
                monitoringWindow: data.monitoringWindow,
            },
            include: {
                system: true,
            },
        });
    }

    async findSLAHistory(
        query: SLAHistoryQuery,
    ): Promise<SlaReportWithSystem[]> {
        const { systemId, limit = 12, startDate, endDate } = query;

        const whereClause: any = { systemId };

        if (startDate && endDate) {
            whereClause.periodStart = { gte: startDate };
            whereClause.periodEnd = { lte: endDate };
        }

        return this.prisma.slaReport.findMany({
            where: whereClause,
            orderBy: { periodStart: 'desc' },
            take: limit,
            include: {
                system: true,
            },
        });
    }

    async findMonthlySLAReports(
        query: MonthlySLAReportQuery,
    ): Promise<SlaReportWithSystem[]> {
        const { month, systemIds } = query;
        const targetDate = month || new Date();
        const startOfMonth = new Date(
            targetDate.getFullYear(),
            targetDate.getMonth(),
            1,
        );
        const endOfMonth = new Date(
            startOfMonth.getFullYear(),
            startOfMonth.getMonth() + 1,
            0,
        );

        const whereClause: any = {
            periodStart: { gte: startOfMonth },
            periodEnd: { lte: endOfMonth },
        };

        if (systemIds && systemIds.length > 0) {
            whereClause.systemId = { in: systemIds };
        }

        return this.prisma.slaReport.findMany({
            where: whereClause,
            include: {
                system: true,
            },
            orderBy: { uptimePct: 'desc' },
        });
    }

    async calculateCurrentSLA(
        systemId: string,
        period: SLACalculationPeriod,
    ): Promise<SLAMetrics> {
        const { start, end } = period;

        try {
            // Buscar métricas de diferentes tipos (API > PING > SNMP)
            const [apiMetrics, pingMetrics, snmpMetrics] = await Promise.all([
                this.timeSeriesClient.apiMetrics.findMany({
                    where: {
                        deviceId: systemId,
                        time: { gte: start, lte: end },
                    },
                }),
                this.timeSeriesClient.pingMetrics.findMany({
                    where: {
                        deviceId: systemId,
                        time: { gte: start, lte: end },
                    },
                }),
                this.timeSeriesClient.snmpMetrics.findMany({
                    where: {
                        deviceId: systemId,
                        time: { gte: start, lte: end },
                    },
                }),
            ]);

            let totalChecks = 0;
            let successfulChecks = 0;
            let totalResponseTime = 0;
            let responseTimeCount = 0;

            // Priorizar API metrics
            if (apiMetrics.length > 0) {
                totalChecks = apiMetrics.length;
                successfulChecks = apiMetrics.filter(
                    (m) =>
                        m.statusCode !== null &&
                        m.statusCode >= 200 &&
                        m.statusCode < 400,
                ).length;

                const validResponseTimes = apiMetrics.filter(
                    (m) => m.responseTimeMs !== null,
                );
                totalResponseTime = validResponseTimes.reduce(
                    (sum, m) => sum + (m.responseTimeMs || 0),
                    0,
                );
                responseTimeCount = validResponseTimes.length;
            }
            // Fallback para PING metrics
            else if (pingMetrics.length > 0) {
                totalChecks = pingMetrics.length;
                successfulChecks = pingMetrics.filter(
                    (m) => m.status === 1,
                ).length;

                const validLatencies = pingMetrics.filter(
                    (m: pingResult) => m.latency !== null,
                );
                totalResponseTime = validLatencies.reduce(
                    (sum: any, m: any) => sum + (m.latency || 0),
                    0,
                );
                responseTimeCount = validLatencies.length;
            }
            else if (snmpMetrics.length > 0) {
                totalChecks = snmpMetrics.length;
                successfulChecks = snmpMetrics.filter(
                    (m: any) => m.status === 1,
                ).length;
            }

            const uptimePercentage =
                totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 0;
            const averageResponseTime =
                responseTimeCount > 0
                    ? totalResponseTime / responseTimeCount
                    : undefined;

            return {
                totalChecks,
                successfulChecks,
                failedChecks: totalChecks - successfulChecks,
                uptimePercentage,
                downtime: totalChecks - successfulChecks,
                averageResponseTime,
                lastCheckTime: totalChecks > 0 ? end : undefined,
            };
        } catch (error) {
            // Se não há dados de time series, retornar métricas zeradas
            return {
                totalChecks: 0,
                successfulChecks: 0,
                failedChecks: 0,
                uptimePercentage: 0,
                downtime: 0,
                averageResponseTime: undefined,
                lastCheckTime: undefined,
            };
        }
    }

    async createSLAReport(
        systemId: string,
        period: SLACalculationPeriod,
        metrics: SLAMetrics,
    ) {
        return prisma.slaReport.create({
            data: {
                systemId,
                periodStart: period.start,
                periodEnd: period.end,
                uptimePct: metrics.uptimePercentage,
                downtime: metrics.downtime,
                incidents: metrics.failedChecks,
            },
        });
    }

    async checkSystemExists(systemId: string): Promise<boolean> {
        const system = await prisma.system.findUnique({
            where: { id: systemId },
            select: { id: true },
        });
        return !!system;
    }

}
