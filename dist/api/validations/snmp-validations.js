"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSystemSchema = exports.snmpConfigSchema = void 0;
const zod_1 = require("zod");
exports.snmpConfigSchema = zod_1.z.object({
    host: zod_1.z.string().min(1),
    port: zod_1.z.number().int().min(1).max(65535).default(161),
    community: zod_1.z.string().min(1),
    version: zod_1.z.enum(['1', '2c', '3']).default('2c'),
    oids: zod_1.z.array(zod_1.z.string()).min(1),
    timeout: zod_1.z.number().int().min(1000).max(30000).default(5000),
    retries: zod_1.z.number().int().min(0).max(5).default(3),
});
exports.createSystemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    host: zod_1.z.string().min(1),
    alert_email: zod_1.z.string().email(),
    monitors: zod_1.z
        .array(zod_1.z.object({
        type: zod_1.z.literal('SNMP'),
        config: exports.snmpConfigSchema,
        interval: zod_1.z.number().int().min(30).max(3600).default(120),
    }))
        .min(1),
});
//# sourceMappingURL=snmp-validations.js.map