// src/api/middlewares/auditLog.plugin.ts
import { FastifyInstance } from 'fastify';
import { auditLogService } from '../services/AuditLog.Service.ts';

export async function auditLogPlugin(fastify: FastifyInstance) {
    fastify.addHook('onSend', async (request, reply, payload) => {
        try {
            const logEntry = {
                user_id: request.user?.id ?? null,
                action: request.method,
                object_type: 'http_request',
                object_id: request.url,
                details: {
                    ip: request.ip,
                    status_code: reply.statusCode,
                    params: request.params,
                    query: request.query,
                    body: request.body,
                },
            };

            await auditLogService.logRequest(logEntry);
        } catch (err) {
            console.error('Erro ao registrar log de auditoria:', err);
        }

        return payload;
    });
}
