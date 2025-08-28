import { Prisma, audit_logs } from '@prisma/client';
import { prisma } from '../../config/database';

class AuditLogRepository {
    async createLog(
        data: Omit<Prisma.audit_logsCreateInput, 'id' | 'created_at'>,
    ) {
        return prisma.audit_logs.create({ data });
    }
}

export const auditLogRepository = new AuditLogRepository();
