// src/services/api-service.ts
import { apiRepository } from '../repositories/api-repository';
import type { SystemWithApi, ApiResult, ApiMetrics } from '../types/api-types';
import { ApiMonitor } from '../../monitors/api-monitor';
import { systemRepository } from '../repositories/SystemRepositories';
import { alertRepository } from '../repositories/alert.repository';

export class ApiService {
  async getAllApiSystems(): Promise<SystemWithApi[]> {
    return await apiRepository.findAllApiSystems();
  }

  async getApiSystemById(id: string): Promise<SystemWithApi> {
    const system = await apiRepository.findApiSystemById(id);
    
    if (!system) {
      throw new Error(`Sistema API com ID ${id} não encontrado`);
    }
    
    return system;
  }

  async testApiConnection(systemId: string): Promise<ApiResult> {
    const system = await this.getApiSystemById(systemId);
    
    if (!system.monitors || system.monitors.length === 0 || !system.monitors[0]) {
      throw new Error('Sistema não possui monitores API configurados');
    }

    const monitor = system.monitors[0];
    const apiMonitor = new ApiMonitor(monitor.config);
    
    return await apiMonitor.check();
  }

  async monitorApiSystem(systemId: string): Promise<ApiResult> {
    const system = await this.getApiSystemById(systemId);
    
    if (!system.monitors || system.monitors.length === 0 || !system.monitors[0]) {
      throw new Error('Sistema não possui monitores API configurados');
    }

    const monitor = system.monitors[0];
    const apiMonitor = new ApiMonitor(monitor.config);
    const result = await apiMonitor.check();

    if (result.status === 'up') {
      const metrics = this.convertToMetrics(systemId, result);
      await apiRepository.saveMetrics(metrics);
    } else if (result.status === 'down' && system.status !== 'down') {
      await alertRepository.createAlertForAPI(
        systemId,
        'API no estado Down',
        `A API ${system.name} não está respondendo: ${result.error || 'Status code ' + result.statusCode}`
      );
    } else if (result.status === 'warning' && system.status !== 'warning') {
      await alertRepository.createAlertForAPI(
        systemId,
        'API com warning',
        `A API ${system.name} retornou resposta inesperada: Status code ${result.statusCode}`
      );
    }

    await systemRepository.updateSystemStatus(systemId, result.status);
    return result;
  }

  async monitorAllApiSystems(): Promise<Record<string, ApiResult>> {
    const systems = await this.getAllApiSystems();
    const results: Record<string, ApiResult> = {};
    const batches = this.chunkArray(systems, 5);

    for (const batch of batches) {
      const promises = batch.map(async system => {
        try {
          results[system.id] = await this.monitorApiSystem(system.id);
        } catch (error) {
          results[system.id] = {
            status: 'unknown',
            timestamp: new Date(),
            responseTime: 0,
            endpoint: system.monitors[0]?.config?.url || '',
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
  ): Promise<ApiMetrics[]> {
    await this.getApiSystemById(systemId);
    return await apiRepository.getMetricsHistory(systemId, from, to);
  }

  async getSystemLastMetrics(
    systemId: string,
    limit: number = 50
  ): Promise<ApiMetrics[]> {
    await this.getApiSystemById(systemId);
    return await apiRepository.getLastMetrics(systemId, limit);
  }

  async getSystemStatus(systemId: string): Promise<{
    system: SystemWithApi;
    lastCheck: ApiResult;
    recentMetrics: ApiMetrics[];
  }> {
    const system = await this.getApiSystemById(systemId);
    const lastCheck = await this.testApiConnection(systemId);
    const recentMetrics = await this.getSystemLastMetrics(systemId, 10);

    return {
      system,
      lastCheck,
      recentMetrics,
    };
  }

  private convertToMetrics(systemId: string, result: ApiResult): ApiMetrics {
    return {
      time: result.timestamp,
      deviceId: systemId,
      endpoint: result.endpoint,
      statusCode: result.statusCode || 0,
      responseTimeMs: result.responseTime,
      payloadSize: result.payloadSize || 0,
    };
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export const apiService = new ApiService();