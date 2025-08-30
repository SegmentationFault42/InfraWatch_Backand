import { Prisma } from '@prisma/client';
declare class AuditLogService {
    private sanitizeJsonValue;
    logRequest(data: {
        user_id?: string | null;
        action: string;
        object_type: string;
        object_id: string;
        details: unknown;
    }): Promise<{
        id: string;
        userId: string | null;
        action: string;
        object_type: string | null;
        object_id: string | null;
        details: Prisma.JsonValue | null;
        created_at: Date;
    }>;
}
export declare const auditLogService: AuditLogService;
export {};
//# sourceMappingURL=AuditLog.Service.d.ts.map