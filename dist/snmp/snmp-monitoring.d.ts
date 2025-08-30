import { SnmpConfig, SnmpResult } from '../api/types/snmp-types';
export declare class SnmpMonitor {
    private config;
    private session;
    constructor(config: SnmpConfig);
    check(): Promise<SnmpResult>;
    private createSession;
    private queryOids;
    private parseSnmpValue;
    private getSnmpVersion;
    private closeSession;
    testConnection(): Promise<boolean>;
    getSystemInfo(): Promise<Record<string, any>>;
    querySpecificOids(oids: string[]): Promise<Record<string, any>>;
    walkOid(baseOid: string): Promise<Record<string, any>>;
}
//# sourceMappingURL=snmp-monitoring.d.ts.map