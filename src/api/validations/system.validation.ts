import { z } from 'zod';

const monitorInputSchema = z.object({
    type: z.enum(['API', 'PING', 'SNMP', 'WEBHOOK']),
    config: z.any(),
    interval: z.number().int().positive().optional(),
});

const slaConfigInputSchema = z.object({
    uptimeTarget: z.number().min(0).max(100),
    maxDowntime: z.number().int().nonnegative().optional(),
    responseTimeTarget: z.number().int().positive().optional(),
    monitoringWindow: z.string().optional(),
});

class SystemValidation {
    createSystemSchema = z.object({
        name: z.string().min(1, 'Nome é obrigatório'),
        host: z.string().min(1, 'Host é obrigatório'),
        alert_email: z.string().email('E-mail inválido'),
        monitors: z.array(monitorInputSchema).optional(),
        slaConfig: slaConfigInputSchema.optional(),
    });

    getById = z.object({
        id: z.string().uuid('ID deve ser um UUID válido'),
    });

    getByUpdate = z.object({
        name: z.string().min(1).optional(),
        host: z.string().min(1).optional(),
        alert_email: z.string().email('E-mail inválido').optional(),
        status: z.enum(['up', 'down', 'warning', 'unknown']).optional(),
    });
}

export const systemValidation = new SystemValidation();
