"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = wait;
exports.sendPing = sendPing;
exports.pingHost = pingHost;
exports.pingMultipleHosts = pingMultipleHosts;
const ping_1 = __importDefault(require("ping"));
const ping_utils_1 = require("./ping.utils");
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sendPing(target, options) {
    const res = await ping_1.default.promise.probe(target, {
        timeout: Math.ceil(options.timeoutMs / 1000),
        packetSize: options.packetSize,
        extra: ['-t', String(options.ttl)],
    });
    if (res.alive) {
        const time = typeof res.time === 'string' ? parseFloat(res.time) : res.time;
        return time;
    }
    else {
        throw new Error(`Host ${target} is unreachable`);
    }
}
async function pingHost(target, options) {
    const opts = (0, ping_utils_1.merge_ping_options)(options);
    if (opts.timeoutMs <= 0) {
        return {
            target,
            alive: false,
            attempts: 0,
            error: 'Timeout must be greater than zero',
            timestamp: (0, ping_utils_1.get_timestamp)(),
        };
    }
    if (opts.retries < 0) {
        return {
            target,
            alive: false,
            attempts: 0,
            error: 'Retries must be >= 0',
            timestamp: (0, ping_utils_1.get_timestamp)(),
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
                timestamp: (0, ping_utils_1.get_timestamp)(),
                ttl: opts.ttl,
            };
        }
        catch (err) {
            if (attempts < maxAttempts) {
                await wait(intervalMs);
            }
            else {
                return {
                    target,
                    alive: false,
                    attempts,
                    error: err instanceof Error ? err.message : String(err),
                    timestamp: (0, ping_utils_1.get_timestamp)(),
                };
            }
        }
    }
    throw new Error('Unexpected ping loop exit');
}
async function pingMultipleHosts(targets, options) {
    const opts = (0, ping_utils_1.merge_ping_options)(options);
    const concurrency = Math.max(1, opts.concurrency || 1);
    const results = [];
    let index = 0;
    const total = targets.length;
    async function worker() {
        while (index < total) {
            const target = targets[index++];
            if (target === undefined)
                break;
            const result = await pingHost(target, options);
            results.push(result);
        }
    }
    const workers = Array.from({ length: concurrency }, worker);
    await Promise.all(workers);
    return results;
}
//# sourceMappingURL=ping.service.js.map