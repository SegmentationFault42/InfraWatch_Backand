import type { PingOptions, pingResult } from './ping.config';
export declare function wait(ms: number): Promise<void>;
export declare function sendPing(target: string, options: Required<PingOptions>): Promise<number>;
export declare function pingHost(target: string, options?: PingOptions): Promise<pingResult>;
export declare function pingMultipleHosts(targets: string[], options?: PingOptions): Promise<pingResult[]>;
//# sourceMappingURL=ping.service.d.ts.map