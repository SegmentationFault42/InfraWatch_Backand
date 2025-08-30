// src/repositories/api-repository.ts
import { prisma, timeseries } from '../../config/database';
import type { SystemWithApi, ApiMetrics, ApiConfig } from '../types/api-types';

class ApiRepository {
  async findApiSystemById(id: string): Promise<SystemWithApi | null> {
    const system = await prisma.system.findUnique({
      where: { id },
      include: {
        monitors: {
          where: { type: 'API' },
        },
      },
    });

    if (!system || system.monitors.length === 0) return null;

    return {
      ...system,
      monitors: system.monitors.map(monitor => ({
        id: monitor.id,
        type: 'API' as const,
        config: monitor.config as unknown as ApiConfig,
        interval: monitor.interval || 60,
        enabled: monitor.enabled,
      })),
    };
  }

  async findAllApiSystems(): Promise<SystemWithApi[]> {
    const systems = await prisma.system.findMany({
      include: {
        monitors: {
          where: { type: 'API' },
        },
      },
    });

    return systems
      .filter(system => system.monitors.length > 0)
      .map(system => ({
        ...system,
        monitors: system.monitors.map(monitor => ({
          id: monitor.id,
          type: 'API' as const,
          config: monitor.config as unknown as ApiConfig,
          interval: monitor.interval || 60,
          enabled: monitor.enabled,
        })),
      }));
  }

  async saveMetrics(metrics: ApiMetrics): Promise<void> {
    await timeseries.apiMetrics.create({
      data: {
        time: metrics.time,
        deviceId: metrics.deviceId,
        endpoint: metrics.endpoint,
        statusCode: metrics.statusCode,
        responseTimeMs: metrics.responseTimeMs,
        payloadSize: metrics.payloadSize,
      },
    });
  }

  async getMetricsHistory(
    deviceId: string,
    from: Date,
    to: Date
  ): Promise<ApiMetrics[]> {
    const metrics = await timeseries.apiMetrics.findMany({
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

    return metrics.map(m => ({
      time: m.time,
      deviceId: m.deviceId,
      endpoint: m.endpoint || '',
      statusCode: m.statusCode || 0,
      responseTimeMs: m.responseTimeMs || 0,
      payloadSize: m.payloadSize || 0,
    }));
  }

  async getLastMetrics(deviceId: string, limit: number = 10): Promise<ApiMetrics[]> {
    const metrics = await timeseries.apiMetrics.findMany({
      where: { deviceId },
      orderBy: { time: 'desc' },
      take: limit,
    });

    return metrics.map(m => ({
      time: m.time,
      deviceId: m.deviceId,
      endpoint: m.endpoint || '',
      statusCode: m.statusCode || 0,
      responseTimeMs: m.responseTimeMs || 0,
      payloadSize: m.payloadSize || 0,
    }));
  }
}

export const apiRepository = new ApiRepository();