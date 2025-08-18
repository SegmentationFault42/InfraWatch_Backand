import { auditLogRepository } from '../repositories/auditLogRepository.ts';
import { Audit_log } from '@prisma/client';

export class AuditLogService {
    async logRequest(Data: Omit<Audit_log, 'id'>) {
        try {
            await auditLogRepository.createLog(Data);
        } catch (error) {
            console.error('Erro ao salvar log de auditoria:', error);
        }
    }
}

export const auditLogService = new AuditLogService();
