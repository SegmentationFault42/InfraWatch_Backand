import { Prisma } from '@prisma/client';
declare class AuditLogRepository {
    createLog(data: Omit<Prisma.audit_logsCreateInput, 'id' | 'created_at'>): Promise<{
        id: string;
        userId: string | null;
        action: string;
        object_type: string | null;
        object_id: string | null;
        details: Prisma.JsonValue | null;
        created_at: Date;
    }>;
}
export declare const auditLogRepository: AuditLogRepository;
export {};
//# sourceMappingURL=auditLogRepository.d.ts.map