// src/types/ping-types.ts
export interface PingConfig {
    host: string;
    timeout: number;
    retries: number;
    packetSize: number;
}

export interface PingMonitor {
    id?: string;
    type: 'PING';
    config: PingConfig;
    interval: number;
    enabled?: boolean;
}

export interface PingResult {
    status: 'up' | 'down' | 'warning' | 'unknown';
    timestamp: Date;
    responseTime: number;
    packetLoss: number;
    error?: string;
    host: string;
}

export interface SystemWithPing {
    id: string;
    name: string;
    host: string;
    status: 'up' | 'down' | 'warning' | 'unknown';
    alert_email?: string;
    monitors: PingMonitor[];
    createdAt: Date;
    updatedAt: Date;
}

export interface PingMetrics {
    time: Date;
    systemId: string;
    host: string;
    responseTime: number;
    packetLoss: number;
    status: number; // 1=up, 0=down, 2=warning, -1=unknown
}
