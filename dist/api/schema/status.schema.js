"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusSchema = void 0;
exports.getStatusSchema = {
    description: 'Verifica se o backend está operacional',
    tags: ['Healthcheck'],
    summary: 'Retorna o status do serviço',
    response: {
        200: {
            description: 'Status do serviço',
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ok' },
                uptime: { type: 'number', example: 12345 },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    },
};
//# sourceMappingURL=status.schema.js.map