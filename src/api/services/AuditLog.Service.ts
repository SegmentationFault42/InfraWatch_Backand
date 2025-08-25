// src/api/services/AuditLog.service.ts
import { auditLogRepository } from '../repositories/auditLogRepository.ts';
import { Prisma } from '@prisma/client';

class AuditLogService {
    private sanitizeJsonValue(value: unknown): Prisma.InputJsonValue {
        if (value === undefined || value === null) return {};
        if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
        )
            return value;
        if (Array.isArray(value))
            return value.map((v) => this.sanitizeJsonValue(v));
        if (typeof value === 'object') {
            const obj: Record<string, Prisma.InputJsonValue> = {};
            for (const [key, val] of Object.entries(value)) {
                if (key === 'password' || key === 'token') continue;
                obj[key] = this.sanitizeJsonValue(val);
            }
            return obj;
        }
        return {};
    }

    async logRequest(data: {
        user_id?: string | null;
        action: string;
        object_type: string;
        object_id: string;
        details: unknown;
    }) {
        const logData = {
            user_id: data.user_id ?? null,
            action: data.action,
            object_type: data.object_type,
            object_id: data.object_id,
            details: this.sanitizeJsonValue(data.details),
        };

        return auditLogRepository.createLog(logData);
    }
}

export const auditLogService = new AuditLogService();
