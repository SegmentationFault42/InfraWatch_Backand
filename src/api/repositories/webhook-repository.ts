// src/repositories/webhook-repository.ts
import { prisma, timeseries } from '../../config/database';
import type { SystemWithWebhook, WebhookMetrics, WebhookConfig, IncomingWebhookData } from '../types/webhook-types';

class WebhookRepository {
  async findWebhookSystemById(id: string): Promise<SystemWithWebhook | null> {
    const system = await prisma.system.findUnique({
      where: { id },
      include: {
        monitors: {
          where: { type: 'WEBHOOK' },
        },
      },
    });

    if (!system || system.monitors.length === 0) return null;

    return {
      ...system,
      monitors: system.monitors.map(monitor => ({
        id: monitor.id,
        type: 'WEBHOOK' as const,
        config: monitor.config as unknown as WebhookConfig,
        enabled: monitor.enabled,
      })),
    };
  }

  async findAllWebhookSystems(): Promise<SystemWithWebhook[]> {
    const systems = await prisma.system.findMany({
      include: {
        monitors: {
          where: { type: 'WEBHOOK' },
        },
      },
    });

    return systems
      .filter(system => system.monitors.length > 0)
      .map(system => ({
        ...system,
        monitors: system.monitors.map(monitor => ({
          id: monitor.id,
          type: 'WEBHOOK' as const,
          config: monitor.config as unknown as WebhookConfig,
          enabled: monitor.enabled,
        })),
      }));
  }

  async saveIncomingWebhookData(data: IncomingWebhookData): Promise<void> {
    await timeseries.incomingWebhooks.create({
      data: {
        systemId: data.systemId,
        timestamp: data.timestamp,
        status: data.status,
        message: data.message,
        data: JSON.stringify(data.data),
        source: data.source,
        receivedAt: data.receivedAt,
      },
    });
  }

  async saveMetrics(metrics: WebhookMetrics): Promise<void> {
    await timeseries.webhookMetrics.create({
      data: {
        time: metrics.time,
        systemId: metrics.systemId,
        status: metrics.status,
        message: metrics.message,
        source: metrics.source,
        eventType: metrics.eventType,
      },
    });
  }

  async getIncomingWebhookHistory(
    systemId: string,
    from: Date,
    to: Date
  ): Promise<IncomingWebhookData[]> {
    const webhooks = await timeseries.incomingWebhooks.findMany({
      where: {
        systemId,
        receivedAt: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { receivedAt: 'desc' },
      take: 1000,
    });

    return webhooks.map(w => ({
      systemId: w.systemId,
      timestamp: w.timestamp,
      status: w.status as any,
      message: w.message,
      data: w.data ? JSON.parse(w.data) : undefined,
      source: w.source,
      receivedAt: w.receivedAt,
    }));
  }

  async getMetricsHistory(
    systemId: string,
    from: Date,
    to: Date
  ): Promise<WebhookMetrics[]> {
    const metrics = await timeseries.webhookMetrics.findMany({
      where: {
        systemId,
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
      systemId: m.systemId,
      status: m.status,
      message: m.message,
      source: m.source,
      eventType: m.eventType,
    }));
  }

  async countWebhooksReceived(systemId: string): Promise<number> {
    return await timeseries.incomingWebhooks.count({
      where: { systemId },
    });
  }
}

export const webhookRepository = new WebhookRepository();