// src/repositories/ping-repository.ts

import { prisma, timeseries } from '../../config/database';
import type {
    SystemWithPing,
    PingMetrics,
    PingConfig,
} from '../types/ping-types';

class PingRepository {
    async findPingSystemById(id: string): Promise<SystemWithPing | null> {
        const system = await prisma.system.findUnique({
            where: { id },
            include: {
                monitors: {
                    where: { type: 'PING' },
                },
            },
        });

        if (!system || system.monitors.length === 0) return null;

        return {
            ...system,
            monitors: system.monitors.map((monitor) => ({
                id: monitor.id,
                type: 'PING' as const,
                config: monitor.config as unknown as PingConfig,
                interval: monitor.interval || 60,
            })),
        };
    }

    async findAllPingSystems(): Promise<SystemWithPing[]> {
        const systems = await prisma.system.findMany({
            include: {
                monitors: {
                    where: { type: 'PING' },
                },
            },
        });

        return systems
            .filter((system) => system.monitors.length > 0)
            .map((system) => ({
                ...system,
                monitors: system.monitors.map((monitor) => ({
                    id: monitor.id,
                    type: 'PING' as const,
                    config: monitor.config as unknown as PingConfig,
                    interval: monitor.interval || 60,
                })),
            }));
    }

    async saveMetrics(metrics: PingMetrics): Promise<void> {
        await timeseries.pingMetrics.create({
            data: {
                time: metrics.time,
                deviceId: metrics.systemId,
                ip: metrics.host,
                packetLoss: metrics.packetLoss,
                status: metrics.status,
            },
        });
    }

    async getMetricsHistory(
        systemId: string,
        from: Date,
        to: Date,
    ): Promise<PingMetrics[]> {
        const metrics = await timeseries.pingMetrics.findMany({
            where: {
                deviceId: systemId,
                time: {
                    gte: from,
                    lte: to,
                },
            },
            orderBy: { time: 'desc' },
            take: 1000,
        });

        return metrics.map((m: any) => ({
            time: m.time,
            systemId: m.systemId,
            host: m.host,
            responseTime: m.responseTime,
            packetLoss: m.packetLoss,
            status: m.status,
        }));
    }

    async getLastMetrics(
        systemId: string,
        limit: number = 10,
    ): Promise<PingMetrics[]> {
        const metrics = await timeseries.pingMetrics.findMany({
            where: { deviceId: systemId },
            orderBy: { time: 'desc' },
            take: limit,
        });

        return metrics.map((m: any) => ({
            time: m.time,
            systemId: m.systemId,
            host: m.host,
            responseTime: m.responseTime,
            packetLoss: m.packetLoss,
            status: m.status,
        }));
    }
}

export const pingRepository = new PingRepository();
