import { Prisma } from '../../config/database.ts';
import { Audit_logs } from '@prisma/client';

class AuditLogRepository {
    async createLog(data: Omit<Audit_logs, 'id'>) {
        return Prisma.audit_logs.create({
            data: {
                user_id: data.user_id,
                method: data.method,
                url: data.url,
                ip: data.ip,
                status_code: data.status_code,
                duration_ms: data.duration_ms,
                params: JSON.stringify(data.params || {}),
                query: JSON.stringify(data.query || {}),
                body: JSON.stringify(data.body || {}),
                timestamp: new Date(),
            },
        });
    }
}

export const auditLogRepository = new AuditLogRepository();
