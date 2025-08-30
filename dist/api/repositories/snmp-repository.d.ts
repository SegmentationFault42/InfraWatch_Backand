import { PrismaClient } from '@prisma/client';
import { PrismaClient as TimeseriesClient } from '../../../node_modules/.prisma/client-timeseries';
import type { SnmpMetrics, SystemWithSnmp } from '../types/snmp-types';
export declare class SnmpRepository {
    private prisma;
    private timeseries;
    constructor(prisma: PrismaClient, timeseries: TimeseriesClient);
    findSnmpSystemById(id: string): Promise<SystemWithSnmp | null>;
    findAllSnmpSystems(): Promise<SystemWithSnmp[]>;
    saveMetrics(metrics: SnmpMetrics): Promise<void>;
    updateSystemStatus(systemId: string, status: 'up' | 'down' | 'warning' | 'unknown'): Promise<void>;
    getMetricsHistory(deviceId: string, from: Date, to: Date): Promise<SnmpMetrics[]>;
    getLastMetrics(deviceId: string, limit?: number): Promise<SnmpMetrics[]>;
}
//# sourceMappingURL=snmp-repository.d.ts.map