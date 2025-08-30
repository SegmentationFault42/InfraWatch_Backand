"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default_ping_options = exports.ping_options_schema = void 0;
exports.merge_ping_options = merge_ping_options;
exports.get_timestamp = get_timestamp;
const zod_1 = require("zod");
exports.ping_options_schema = zod_1.z.object({
    timeoutMs: zod_1.z.number().positive().default(2000),
    retries: zod_1.z.number().int().min(0).default(1),
    intervalMs: zod_1.z.number().min(0).default(1000),
    packetSize: zod_1.z.number().positive().default(56),
    ttl: zod_1.z.number().positive().default(64),
    concurrency: zod_1.z.number().int().positive().default(1),
    provider: zod_1.z.enum(['system', 'net-ping', 'raw']).default('system'),
});
exports.default_ping_options = exports.ping_options_schema.parse({});
function merge_ping_options(options) {
    const merged = { ...exports.default_ping_options, ...options };
    return exports.ping_options_schema.parse(merged);
}
function get_timestamp() {
    return new Date().toISOString();
}
//# sourceMappingURL=ping.utils.js.map