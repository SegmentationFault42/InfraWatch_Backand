"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogService = void 0;
// src/api/services/AuditLog.service.ts
const auditLogRepository_1 = require("../repositories/auditLogRepository");
class AuditLogService {
    sanitizeJsonValue(value) {
        if (value === undefined || value === null)
            return {};
        if (typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean')
            return value;
        if (Array.isArray(value))
            return value.map((v) => this.sanitizeJsonValue(v));
        if (typeof value === 'object') {
            const obj = {};
            for (const [key, val] of Object.entries(value)) {
                if (key === 'password' || key === 'token')
                    continue;
                obj[key] = this.sanitizeJsonValue(val);
            }
            return obj;
        }
        return {};
    }
    async logRequest(data) {
        const logData = {
            user_id: data.user_id ?? null,
            action: data.action,
            object_type: data.object_type,
            object_id: data.object_id,
            details: this.sanitizeJsonValue(data.details),
        };
        return auditLogRepository_1.auditLogRepository.createLog(logData);
    }
}
exports.auditLogService = new AuditLogService();
//# sourceMappingURL=AuditLog.Service.js.map