export interface SnmpConfig {
    host: string;
    port: number;
    community: string;
    version: '1' | '2c' | '3';
    oids: string[];
    timeout: number;
    retries?: number;
}

export interface SnmpResult {
    status: 'up' | 'down' | 'warning' | 'unknown'; 
    timestamp: Date;
    responseTime: number;
    values: Record<string, any>;
    error?: string;
}

export interface SnmpMetrics {
    time: Date;
    deviceId: string;
    interfaceName?: string;
    inOctets?: bigint;
    outOctets?: bigint;
    cpu?: number;
    memory?: number;
    status?: number;
    temperature?: number;
}

export interface SystemWithSnmp {
    id: string;
    name: string;
    host: string;
    status: 'up' | 'down' | 'warning' | 'unknown';
    alert_email: string;
    monitors: {
        id: string;
        type: 'SNMP';
        config: SnmpConfig;
        interval: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

export interface SnmpDashboard {
    summary: {
        total_systems: number;
        up_systems: number;
        down_systems: number;
        warning_systems: number;
        overall_uptime: number;
    };
    systems: Array<
        SystemWithSnmp & {
            current_status: SnmpResult;
        }
    >;
}

export interface SnmpSystemInfo {
    sysDescr?: string;
    sysObjectID?: string;
    sysUpTime?: number;
    sysContact?: string;
    sysName?: string;
    sysLocation?: string;
}

export interface SnmpWalkResult {
    oid: string;
    value: any;
    type: string;
}
