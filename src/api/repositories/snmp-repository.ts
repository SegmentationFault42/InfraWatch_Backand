import { PrismaClient } from '@prisma/client';
import { PrismaClient as TimeseriesClient } from '../../../node_modules/.prisma/client-timeseries';
import type {
    SnmpConfig,
    SnmpMetrics,
    SystemWithSnmp,
} from '../types/snmp-types';

export class SnmpRepository {
    constructor(
        private prisma: PrismaClient,
        private timeseries: TimeseriesClient,
    ) {}

    // ... resto do código ...

    async findSnmpSystemById(id: string): Promise<SystemWithSnmp | null> {
        const system = await this.prisma.system.findUnique({
            where: { id },
            include: {
                monitors: {
                    where: { type: 'SNMP' },
                },
            },
        });

        // ✅ Verificar se sistema existe E tem monitores SNMP
        if (!system || system.monitors.length === 0) return null;

        return {
            ...system,
            monitors: system.monitors.map((monitor) => ({
                id: monitor.id,
                type: 'SNMP' as const,
                config: monitor.config as unknown as SnmpConfig, // ✅ Cast explícito
                interval: monitor.interval || 120,
            })),
        };
    }

    async findAllSnmpSystems(): Promise<SystemWithSnmp[]> {
        const systems = await this.prisma.system.findMany({
            include: {
                monitors: {
                    where: { type: 'SNMP' },
                },
            },
        });

        return (
            systems
                .filter((system) => system.monitors.length > 0)
                .map((system) => ({
                    ...system,
                    monitors: system.monitors.map((monitor) => ({
                        id: monitor.id,
                        type: 'SNMP' as const,
                        config: monitor.config as unknown as SnmpConfig, // ✅ Cast explícito
                        interval: monitor.interval || 120,
                    })),
                }))
        );
    }
    async saveMetrics(metrics: SnmpMetrics): Promise<void> {
        await this.timeseries.snmpMetrics.create({
            data: {
                time: metrics.time,
                deviceId: metrics.deviceId,
                interfaceName: metrics.interfaceName,
                inOctets: metrics.inOctets,
                outOctets: metrics.outOctets,
                cpu: metrics.cpu,
                memory: metrics.memory,
                status: metrics.status,
                temperature: metrics.temperature,
            },
        });
    }

    async updateSystemStatus(
        systemId: string,
        status: 'up' | 'down' | 'warning' | 'unknown',
    ): Promise<void> {
        await this.prisma.system.update({
            where: { id: systemId },
            data: { status, updatedAt: new Date() },
        });
    }

    async getMetricsHistory(
        deviceId: string,
        from: Date,
        to: Date,
    ): Promise<SnmpMetrics[]> {
        const metrics = await this.timeseries.snmpMetrics.findMany({
            where: {
                deviceId,
                time: {
                    gte: from,
                    lte: to,
                },
            },
            orderBy: { time: 'desc' },
            take: 1000, 
        });

        return metrics.map((m) => ({
            time: m.time,
            deviceId: m.deviceId,
            interfaceName: m.interfaceName || undefined,
            inOctets: m.inOctets || undefined,
            outOctets: m.outOctets || undefined,
            cpu: m.cpu || undefined,
            memory: m.memory || undefined,
            status: m.status || undefined,
            temperature: m.temperature || undefined,
        }));
    }

    async getLastMetrics(
        deviceId: string,
        limit: number = 10,
    ): Promise<SnmpMetrics[]> {
        const metrics = await this.timeseries.snmpMetrics.findMany({
            where: { deviceId },
            orderBy: { time: 'desc' },
            take: limit,
        });

        return metrics.map((m) => ({
            time: m.time,
            deviceId: m.deviceId,
            interfaceName: m.interfaceName || undefined,
            inOctets: m.inOctets || undefined,
            outOctets: m.outOctets || undefined,
            cpu: m.cpu || undefined,
            memory: m.memory || undefined,
            status: m.status || undefined,
            temperature: m.temperature || undefined,
        }));
    }
}
