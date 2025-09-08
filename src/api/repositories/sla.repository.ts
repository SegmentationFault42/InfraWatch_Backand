import prisma from '../../config/database';
import { timeseries } from '../../config/database';
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
    async findAllSLAConfigs() {
        const sla = prisma.sLAConfig.findMany({
            include: {
                system: true,
            },
        });
        return sla;
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

    async upsertSLAConfig(systemId: string, data: CreateSLAConfigRequest) {
        return await prisma.sLAConfig.upsert({
            where: { systemId: systemId },
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

        return prisma.slaReport.findMany({
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

        return prisma.slaReport.findMany({
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
            const [apiMetrics, pingMetrics, snmpMetrics] = await Promise.all([
                timeseries.apiMetrics.findMany({
                    where: {
                        deviceId: systemId,
                        time: { gte: start, lte: end },
                    },
                }),
                timeseries.pingMetrics.findMany({
                    where: {
                        deviceId: systemId,
                        time: { gte: start, lte: end },
                    },
                }),
                timeseries.snmpMetrics.findMany({
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

            if (apiMetrics.length > 0) {
                totalChecks = apiMetrics.length;
                successfulChecks = apiMetrics.filter(
                    (
                        m, // Remover o tipo customizado
                    ) =>
                        m.statusCode !== null &&
                        m.statusCode >= 200 &&
                        m.statusCode < 400,
                ).length;

                const validResponseTimes = apiMetrics.filter(
                    (m) => m.responseTimeMs !== null, // Campo correto do schema
                );
                totalResponseTime = validResponseTimes.reduce(
                    (sum, m) => sum + (m.responseTimeMs || 0), // Campo correto
                    0,
                );
                responseTimeCount = validResponseTimes.length;
            } else if (pingMetrics.length > 0) {
                totalChecks = pingMetrics.length;
                successfulChecks = pingMetrics.filter(
                    (m) => m.status === 1, 
                ).length;

                const validLatencies = pingMetrics.filter(
                    (m) => m.latency !== null, 
                );
                totalResponseTime = validLatencies.reduce(
                    (sum, m) => sum + (m.latency || 0),
                    0,
                );
                responseTimeCount = validLatencies.length;
            } else if (snmpMetrics.length > 0) {
                totalChecks = snmpMetrics.length;
                successfulChecks = snmpMetrics.filter(
                    (m) => m.status === 1, 
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
            include: {
                system: true,
            }
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
