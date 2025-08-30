import { SnmpRepository } from '../repositories/snmp-repository';
import type { SnmpResult, SystemWithSnmp, SnmpMetrics, SnmpDashboard } from '../types/snmp-types';
export declare class SnmpService {
    private repository;
    constructor(repository: SnmpRepository);
    getAllSnmpSystems(): Promise<SystemWithSnmp[]>;
    getSnmpSystemById(id: string): Promise<SystemWithSnmp>;
    testSnmpConnection(systemId: string): Promise<SnmpResult>;
    monitorSnmpSystem(systemId: string): Promise<SnmpResult>;
    monitorAllSnmpSystems(): Promise<Record<string, SnmpResult>>;
    getSnmpDashboard(): Promise<SnmpDashboard>;
    getSystemMetrics(systemId: string, from: Date, to: Date): Promise<SnmpMetrics[]>;
    getSystemLastMetrics(systemId: string, limit?: number): Promise<SnmpMetrics[]>;
    getSystemStatus(systemId: string): Promise<{
        system: SystemWithSnmp;
        lastCheck: SnmpResult;
        recentMetrics: SnmpMetrics[];
    }>;
    private convertToMetrics;
    private mapStatusToNumber;
    private extractCpuFromOids;
    private extractMemoryFromOids;
    private extractTemperatureFromOids;
    private extractInOctetsFromOids;
    private extractOutOctetsFromOids;
    private chunkArray;
}
//# sourceMappingURL=snmp-service.d.ts.map