"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogPlugin = auditLogPlugin;
const AuditLog_Service_1 = require("../services/AuditLog.Service");
async function auditLogPlugin(fastify) {
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
            await AuditLog_Service_1.auditLogService.logRequest(logEntry);
        }
        catch (err) {
            console.error('Erro ao registrar log de auditoria:', err);
        }
        return payload;
    });
}
//# sourceMappingURL=AuditLogMiddleware.js.map