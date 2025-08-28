import type { PingOptions } from './ping.config';
import { z } from 'zod';

export const ping_options_schema = z.object({
    timeoutMs: z.number().positive().default(2000),
    retries: z.number().int().min(0).default(1),
    intervalMs: z.number().min(0).default(1000),
    packetSize: z.number().positive().default(56),
    ttl: z.number().positive().default(64),
    concurrency: z.number().int().positive().default(1),
    provider: z.enum(['system', 'net-ping', 'raw']).default('system'),
});

export type PingOptionsValidated = z.infer<typeof ping_options_schema>;

export const default_ping_options: PingOptionsValidated =
    ping_options_schema.parse({});

export function merge_ping_options(
    options?: Partial<PingOptions>,
): PingOptionsValidated {
    const merged = { ...default_ping_options, ...options };
    return ping_options_schema.parse(merged);
}

export function get_timestamp(): string {
    return new Date().toISOString();
}
