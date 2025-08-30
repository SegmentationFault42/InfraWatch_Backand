// src/services/ping-service.ts
import { pingRepository } from '../repositories/pingRepository';
import type { SystemWithPing, PingResult, PingMetrics } from '../types/ping-types';
import { PingMonitor } from '../../ping/ping-monitor';
import { systemRepository } from '../repositories/SystemRepositories';
import { alertRepository } from '../repositories/alert.repository';

export class PingService {
  async getAllPingSystems(): Promise<SystemWithPing[]> {
    return await pingRepository.findAllPingSystems();
  }

  async getPingSystemById(id: string): Promise<SystemWithPing> {
    const system = await pingRepository.findPingSystemById(id);
    
    if (!system) {
      throw new Error(`Sistema PING com ID ${id} não encontrado`);
    }
    
    return system;
  }

  async testPingConnection(systemId: string): Promise<PingResult> {
    const system = await this.getPingSystemById(systemId);
    
    if (!system.monitors || system.monitors.length === 0 || !system.monitors[0]) {
      throw new Error('Sistema não possui monitores PING configurados');
    }

    const monitor = system.monitors[0];
    const pingMonitor = new PingMonitor(monitor.config);
    
    return await pingMonitor.check();
  }

  async monitorPingSystem(systemId: string): Promise<PingResult> {
    const system = await this.getPingSystemById(systemId);
    
    if (!system.monitors || system.monitors.length === 0 || !system.monitors[0]) {
      throw new Error('Sistema não possui monitores PING configurados');
    }

    const monitor = system.monitors[0];
    const pingMonitor = new PingMonitor(monitor.config);
    const result = await pingMonitor.check();

    if (result.status === 'up') {
      const metrics = this.convertToMetrics(systemId, result);
      await pingRepository.saveMetrics(metrics);
    } else if (result.status === 'down' && system.status !== 'down') {
      await alertRepository.createAlertForPING(
        systemId,
        'Sistema no estado Down',
        `O sistema ${system.name} não está respondendo ao ping`
      );
    }

    await systemRepository.updateSystemStatus(systemId, result.status);
    return result;
  }

  async monitorAllPingSystems(): Promise<Record<string, PingResult>> {
    const systems = await this.getAllPingSystems();
    const results: Record<string, PingResult> = {};
    const batches = this.chunkArray(systems, 5);

    for (const batch of batches) {
      const promises = batch.map(async system => {
        try {
          results[system.id] = await this.monitorPingSystem(system.id);
        } catch (error) {
          results[system.id] = {
            status: 'unknown',
            timestamp: new Date(),
            responseTime: 0,
            packetLoss: 100,
            host: system.host,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      });

      await Promise.all(promises);
    }

    return results;
  }

  async getSystemMetrics(
    systemId: string,
    from: Date,
    to: Date
  ): Promise<PingMetrics[]> {
    await this.getPingSystemById(systemId);
    return await pingRepository.getMetricsHistory(systemId, from, to);
  }

  async getSystemLastMetrics(
    systemId: string,
    limit: number = 50
  ): Promise<PingMetrics[]> {
    await this.getPingSystemById(systemId);
    return await pingRepository.getLastMetrics(systemId, limit);
  }

  async getSystemStatus(systemId: string): Promise<{
    system: SystemWithPing;
    lastCheck: PingResult;
    recentMetrics: PingMetrics[];
  }> {
    const system = await this.getPingSystemById(systemId);
    const lastCheck = await this.testPingConnection(systemId);
    const recentMetrics = await this.getSystemLastMetrics(systemId, 10);

    return {
      system,
      lastCheck,
      recentMetrics,
    };
  }

  private convertToMetrics(systemId: string, result: PingResult): PingMetrics {
    return {
      time: result.timestamp,
      systemId,
      host: result.host,
      responseTime: result.responseTime,
      packetLoss: result.packetLoss,
      status: this.mapStatusToNumber(result.status),
    };
  }

  private mapStatusToNumber(status: PingResult['status']): number {
    switch (status) {
      case 'up':
        return 1;
      case 'down':
        return 0;
      case 'warning':
        return 2;
      case 'unknown':
        return -1;
      default:
        return -1;
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export const pingService = new PingService();