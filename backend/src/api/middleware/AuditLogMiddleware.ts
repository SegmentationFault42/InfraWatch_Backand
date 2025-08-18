import { FastifyInstance } from 'fastify';
import { auditLogService } from '../services/AuditLog.Service.ts';

export async function AuditLogsRepository(fastify: FastifyInstance) {
    fastify.addHook('onSend', async (request, reply, payload) => {
        try {
            const logEntry = {
                user_id: request.user?.id || null,
                method: request.method,
                url: request.url,
                ip: request.ip,
                status_code: reply.statusCode,
                params: request.params,
                query: request.query,
                body:
                    request.body && typeof request.body === 'object'
                        ? {
                              ...request.body,
                              password: undefined,
                              token: undefined,
                          }
                        : request.body,
                timestamp: new Date(),
            };

            if (process.env.NODE_ENV === 'development') {
                console.log('[AUDIT LOG]', logEntry);
            } else {
                await auditLogService.logRequest(logEntry);
            }
        } catch (err) {
            console.error('Erro ao registrar log de auditoria:', err);
        }

        return payload;
    });
}
