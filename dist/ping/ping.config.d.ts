export type ProviderName = 'system' | 'net-ping' | 'raw';
export interface PingOptions {
    timeoutMs?: number;
    retries?: number;
    intervalMs?: number;
    packetSize?: number;
    ttl?: number;
    concurrency?: number;
    provider?: ProviderName;
}
export interface pingResult {
    target: string;
    alive: boolean;
    latency?: number;
    attempts: number;
    error?: string;
    timestamp: string;
    ttl?: number;
}
//# sourceMappingURL=ping.config.d.ts.map