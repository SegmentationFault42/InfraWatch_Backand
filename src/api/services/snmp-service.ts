import { SnmpRepository } from '../repositories/snmp-repository';
import type {
    SnmpResult,
    SystemWithSnmp,
    SnmpMetrics,
    SnmpDashboard,
} from '../types/snmp-types';
import { SnmpError } from '../errors/snmp-errors';
import { SnmpMonitor } from '../../snmp/snmp-monitoring';

export class SnmpService {
    constructor(private repository: SnmpRepository) {}

    async getAllSnmpSystems(): Promise<SystemWithSnmp[]> {
        return await this.repository.findAllSnmpSystems();
    }

    async getSnmpSystemById(id: string): Promise<SystemWithSnmp> {
        const system = await this.repository.findSnmpSystemById(id);

        if (!system) {
            throw new Error(`Sistema SNMP com ID ${id} não encontrado`);
        }

        return system;
    }

    async testSnmpConnection(systemId: string): Promise<SnmpResult> {
        const system = await this.getSnmpSystemById(systemId);

        if (
            !system.monitors ||
            system.monitors.length === 0 ||
            !system.monitors[0]
        ) {
            throw new Error('Sistema não possui monitores SNMP configurados');
        }

        const monitor = system.monitors[0]; // Agora garantido que existe
        const snmpMonitor = new SnmpMonitor(monitor.config);

        return await snmpMonitor.check();
    }

    async monitorSnmpSystem(systemId: string): Promise<SnmpResult> {
        const system = await this.getSnmpSystemById(systemId);
        if (
            !system.monitors ||
            system.monitors.length === 0 ||
            !system.monitors[0]
        ) {
            throw new Error('Sistema não possui monitores SNMP configurados');
        }
        const monitor = system.monitors[0];
        const snmpMonitor = new SnmpMonitor(monitor.config);
        const result = await snmpMonitor.check();
        if (result.status === 'up') {
            const metrics = this.convertToMetrics(systemId, result);
            await this.repository.saveMetrics(metrics);
        }
        await this.repository.updateSystemStatus(systemId, result.status);

        return result;
    }

    async monitorAllSnmpSystems(): Promise<Record<string, SnmpResult>> {
        const systems = await this.getAllSnmpSystems();
        const results: Record<string, SnmpResult> = {};

        // Executar em paralelo com limite de 5 simultâneos
        const batches = this.chunkArray(systems, 5);

        for (const batch of batches) {
            const promises = batch.map(async (system) => {
                try {
                    results[system.id] = await this.monitorSnmpSystem(
                        system.id,
                    );
                } catch (error) {
                    // ✅ Usar SnmpResult completo para erro
                    results[system.id] = {
                        status: 'unknown', // ✅ Agora 'unknown' é válido
                        timestamp: new Date(),
                        responseTime: 0,
                        values: {},
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error',
                    };
                }
            });

            await Promise.all(promises);
        }

        return results;
    }

    async getSnmpDashboard(): Promise<SnmpDashboard> {
        const systems = await this.getAllSnmpSystems();
        const results = await this.monitorAllSnmpSystems();

        const upSystems = Object.values(results).filter(
            (r) => r.status === 'up',
        ).length;
        const downSystems = Object.values(results).filter(
            (r) => r.status === 'down',
        ).length;
        const warningSystems = Object.values(results).filter(
            (r) => r.status === 'warning',
        ).length;

        return {
            summary: {
                total_systems: systems.length,
                up_systems: upSystems,
                down_systems: downSystems,
                warning_systems: warningSystems,
                overall_uptime:
                    systems.length > 0
                        ? Math.round((upSystems / systems.length) * 100)
                        : 0,
            },
            systems: systems.map((system) => ({
                ...system,
                // ✅ Fallback usando SnmpResult com 'unknown'
                current_status: results[system.id] || {
                    status: 'unknown' as const,
                    timestamp: new Date(),
                    responseTime: 0,
                    values: {},
                    error: 'Status não disponível',
                },
            })),
        };
    }

    async getSystemMetrics(
        systemId: string,
        from: Date,
        to: Date,
    ): Promise<SnmpMetrics[]> {
        // Verificar se o sistema SNMP existe
        await this.getSnmpSystemById(systemId);

        return await this.repository.getMetricsHistory(systemId, from, to);
    }

    async getSystemLastMetrics(
        systemId: string,
        limit: number = 50,
    ): Promise<SnmpMetrics[]> {
        // Verificar se o sistema SNMP existe
        await this.getSnmpSystemById(systemId);

        return await this.repository.getLastMetrics(systemId, limit);
    }

    async getSystemStatus(systemId: string): Promise<{
        system: SystemWithSnmp;
        lastCheck: SnmpResult;
        recentMetrics: SnmpMetrics[];
    }> {
        const system = await this.getSnmpSystemById(systemId);
        const lastCheck = await this.testSnmpConnection(systemId);
        const recentMetrics = await this.getSystemLastMetrics(systemId, 10);

        return {
            system,
            lastCheck,
            recentMetrics,
        };
    }

    private convertToMetrics(
        systemId: string,
        result: SnmpResult,
    ): SnmpMetrics {
        const values = result.values;

        // Extrair valores dos OIDs conhecidos
        return {
            time: result.timestamp,
            deviceId: systemId,
            cpu: this.extractCpuFromOids(values),
            memory: this.extractMemoryFromOids(values),
            status: this.mapStatusToNumber(result.status),
            temperature: this.extractTemperatureFromOids(values),
            inOctets: this.extractInOctetsFromOids(values),
            outOctets: this.extractOutOctetsFromOids(values),
        };
    }

    // ✅ Helper para mapear status para número
    private mapStatusToNumber(status: SnmpResult['status']): number {
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

    private extractCpuFromOids(
        values: Record<string, any>,
    ): number | undefined {
        // CPU Usage: 1.3.6.1.4.1.2021.11.9.0 (CPU Idle - convert to usage)
        const cpuIdle = values['1.3.6.1.4.1.2021.11.9.0'];
        if (cpuIdle !== undefined) {
            return 100 - parseInt(cpuIdle);
        }

        // Alternative CPU OID: 1.3.6.1.2.1.25.3.3.1.2
        const cpuUsage = values['1.3.6.1.2.1.25.3.3.1.2'];
        if (cpuUsage !== undefined) {
            return parseInt(cpuUsage);
        }

        return undefined;
    }

    private extractMemoryFromOids(
        values: Record<string, any>,
    ): number | undefined {
        // Total Memory: 1.3.6.1.4.1.2021.4.5.0
        // Free Memory: 1.3.6.1.4.1.2021.4.6.0
        const totalMemory = values['1.3.6.1.4.1.2021.4.5.0'];
        const freeMemory = values['1.3.6.1.4.1.2021.4.6.0'];

        if (totalMemory && freeMemory) {
            const used = parseInt(totalMemory) - parseInt(freeMemory);
            return Math.round((used / parseInt(totalMemory)) * 100);
        }

        // Alternative: hrStorageUsed/hrStorageSize * 100
        const storageUsed = values['1.3.6.1.2.1.25.2.3.1.6.1'];
        const storageSize = values['1.3.6.1.2.1.25.2.3.1.5.1'];

        if (storageUsed && storageSize) {
            return Math.round(
                (parseInt(storageUsed) / parseInt(storageSize)) * 100,
            );
        }

        return undefined;
    }

    private extractTemperatureFromOids(
        values: Record<string, any>,
    ): number | undefined {
        // Cisco temperature: 1.3.6.1.4.1.9.9.13.1.3.1.3.1
        const ciscoTemp = values['1.3.6.1.4.1.9.9.13.1.3.1.3.1'];
        if (ciscoTemp) return parseInt(ciscoTemp);

        // Generic temperature OID
        const genericTemp = values['1.3.6.1.2.1.99.1.1.1.4'];
        if (genericTemp) return parseInt(genericTemp);

        return undefined;
    }

    private extractInOctetsFromOids(
        values: Record<string, any>,
    ): bigint | undefined {
        // Interface in octets: 1.3.6.1.2.1.2.2.1.10.1
        const inOctets = values['1.3.6.1.2.1.2.2.1.10.1'];
        return inOctets ? BigInt(inOctets) : undefined;
    }

    private extractOutOctetsFromOids(
        values: Record<string, any>,
    ): bigint | undefined {
        // Interface out octets: 1.3.6.1.2.1.2.2.1.16.1
        const outOctets = values['1.3.6.1.2.1.2.2.1.16.1'];
        return outOctets ? BigInt(outOctets) : undefined;
    }

    private chunkArray<T>(array: T[], size: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
}
