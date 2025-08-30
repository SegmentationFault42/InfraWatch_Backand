import type { PingOptions } from './ping.config';
import { z } from 'zod';
export declare const ping_options_schema: z.ZodObject<{
    timeoutMs: z.ZodDefault<z.ZodNumber>;
    retries: z.ZodDefault<z.ZodNumber>;
    intervalMs: z.ZodDefault<z.ZodNumber>;
    packetSize: z.ZodDefault<z.ZodNumber>;
    ttl: z.ZodDefault<z.ZodNumber>;
    concurrency: z.ZodDefault<z.ZodNumber>;
    provider: z.ZodDefault<z.ZodEnum<{
        system: "system";
        "net-ping": "net-ping";
        raw: "raw";
    }>>;
}, z.core.$strip>;
export type PingOptionsValidated = z.infer<typeof ping_options_schema>;
export declare const default_ping_options: PingOptionsValidated;
export declare function merge_ping_options(options?: Partial<PingOptions>): PingOptionsValidated;
export declare function get_timestamp(): string;
//# sourceMappingURL=ping.utils.d.ts.map