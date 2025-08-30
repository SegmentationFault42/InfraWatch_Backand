"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemValidation = void 0;
const zod_1 = require("zod");
const monitorInputSchema = zod_1.z.object({
    type: zod_1.z.enum(['API', 'PING', 'SNMP', 'WEBHOOK']),
    config: zod_1.z.any(),
    interval: zod_1.z.number().int().positive().optional(),
});
const slaConfigInputSchema = zod_1.z.object({
    uptimeTarget: zod_1.z.number().min(0).max(100),
    maxDowntime: zod_1.z.number().int().nonnegative().optional(),
    responseTimeTarget: zod_1.z.number().int().positive().optional(),
    monitoringWindow: zod_1.z.string().optional(),
});
class SystemValidation {
    createSystemSchema = zod_1.z.object({
        name: zod_1.z.string().min(1, 'Nome é obrigatório'),
        host: zod_1.z.string().min(1, 'Host é obrigatório'),
        alert_email: zod_1.z.string().email('E-mail inválido'),
        monitors: zod_1.z.array(monitorInputSchema).optional(),
        slaConfig: slaConfigInputSchema.optional(),
    });
    getById = zod_1.z.object({
        id: zod_1.z.string().uuid('ID deve ser um UUID válido'),
    });
    getByUpdate = zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        host: zod_1.z.string().min(1).optional(),
        alert_email: zod_1.z.string().email('E-mail inválido').optional(),
        status: zod_1.z.enum(['up', 'down', 'warning', 'unknown']).optional(),
    });
}
exports.systemValidation = new SystemValidation();
//# sourceMappingURL=system.validation.js.map