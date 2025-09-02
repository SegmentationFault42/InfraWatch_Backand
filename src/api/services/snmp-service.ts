import { snmprepository } from '../repositories/snmp-repository';
import type {
    SnmpResult,
    SystemWithSnmp,
    SnmpMetrics,
} from '../types/snmp-types';
import { SnmpMonitor } from '../../snmp/snmp-monitoring';
import { systemRepository } from '../repositories/SystemRepositories';
import { alertRepository } from '../repositories/alert.repository';

export class SnmpService {
    async getAllSnmpSystems(): Promise<SystemWithSnmp[]> {
        return await snmprepository.findAllSnmpSystems();
    }

    async getSnmpSystemById(id: string): Promise<SystemWithSnmp> {
        const system = await snmprepository.findSnmpSystemById(id);

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

        const monitor = system.monitors[0];
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
            await snmprepository.saveMetrics(metrics);
        } else if (result.status === 'down' && system.status !== 'down') {
            alertRepository.createAlertForSNMP(
                systemId,
                `Sistema no estado Down`,
                `O sistema ${system.name} está no estado Down`,
            );
        }
        await systemRepository.updateSystemStatus(systemId, result.status);
        return result;
    }

    async monitorAllSnmpSystems(): Promise<Record<string, SnmpResult>> {
        const systems = await this.getAllSnmpSystems();
        const results: Record<string, SnmpResult> = {};
        const batches = this.chunkArray(systems, 5);

        for (const batch of batches) {
            const promises = batch.map(async (system) => {
                try {
                    results[system.id] = await this.monitorSnmpSystem(
                        system.id,
                    );
                } catch (error) {
                    results[system.id] = {
                        status: 'unknown',
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

    private convertToMetrics(
        systemId: string,
        result: SnmpResult,
    ): SnmpMetrics {
        const values = result.values;

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
        const cpuIdle = values['1.3.6.1.4.1.2021.11.9.0'];
        if (cpuIdle !== undefined) {
            return 100 - parseInt(cpuIdle);
        }

        const cpuUsage = values['1.3.6.1.2.1.25.3.3.1.2'];
        if (cpuUsage !== undefined) {
            return parseInt(cpuUsage);
        }

        return undefined;
    }

    private extractMemoryFromOids(
        values: Record<string, any>,
    ): number | undefined {
        const totalMemory = values['1.3.6.1.4.1.2021.4.5.0'];
        const freeMemory = values['1.3.6.1.4.1.2021.4.6.0'];

        if (totalMemory && freeMemory) {
            const used = parseInt(totalMemory) - parseInt(freeMemory);
            return Math.round((used / parseInt(totalMemory)) * 100);
        }

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

export const snmpservice = new SnmpService();
