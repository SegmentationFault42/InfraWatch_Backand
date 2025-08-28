import ping from 'ping';
import { merge_ping_options, get_timestamp } from './ping.utils';
import type { PingOptions, pingResult } from './ping.config';

export function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendPing(
    target: string,
    options: Required<PingOptions>,
): Promise<number> {
    const res = await ping.promise.probe(target, {
        timeout: Math.ceil(options.timeoutMs / 1000),
        packetSize: options.packetSize,
        extra: ['-t', String(options.ttl)],
    });

    if (res.alive) {
        const time =
            typeof res.time === 'string' ? parseFloat(res.time) : res.time;
        return time;
    } else {
        throw new Error(`Host ${target} is unreachable`);
    }
}

export async function pingHost(
    target: string,
    options?: PingOptions,
): Promise<pingResult> {
    const opts = merge_ping_options(options);

    if (opts.timeoutMs <= 0) {
        return {
            target,
            alive: false,
            attempts: 0,
            error: 'Timeout must be greater than zero',
            timestamp: get_timestamp(),
        };
    }
    if (opts.retries < 0) {
        return {
            target,
            alive: false,
            attempts: 0,
            error: 'Retries must be >= 0',
            timestamp: get_timestamp(),
        };
    }

    let attempts = 0;
    const maxAttempts = opts.retries + 1;
    const intervalMs = Math.max(0, opts.intervalMs);

    while (attempts < maxAttempts) {
        attempts++;
        try {
            const latency = await sendPing(target, opts);
            return {
                target,
                alive: true,
                latency,
                attempts,
                timestamp: get_timestamp(),
                ttl: opts.ttl,
            };
        } catch (err) {
            if (attempts < maxAttempts) {
                await wait(intervalMs);
            } else {
                return {
                    target,
                    alive: false,
                    attempts,
                    error: err instanceof Error ? err.message : String(err),
                    timestamp: get_timestamp(),
                };
            }
        }
    }

    throw new Error('Unexpected ping loop exit');
}

export async function pingMultipleHosts(
    targets: string[],
    options?: PingOptions,
): Promise<pingResult[]> {
    const opts = merge_ping_options(options);
    const concurrency = Math.max(1, opts.concurrency || 1);
    const results: pingResult[] = [];

    let index = 0;
    const total = targets.length;

    async function worker() {
        while (index < total) {
            const target = targets[index++];
            if (target === undefined) break;
            const result = await pingHost(target, options);
            results.push(result);
        }
    }

    const workers = Array.from({ length: concurrency }, worker);
    await Promise.all(workers);

    return results;
}
