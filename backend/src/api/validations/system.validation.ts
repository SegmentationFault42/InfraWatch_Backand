import { z } from 'zod';

class SystemValidation {
    createSystemSchema = z.object({
        name: z.string().min(1, 'Nome é obrigatório'),
        url: z.string().url('URL inválida'),
        monitor_type: z.enum(['http', 'https', 'ping', 'tcp']),
        check_interval: z.number().int().positive().default(60),
        timeout: z.number().int().positive().default(30),
        is_enabled: z.boolean().default(true),
        alert_email: z.string().email('E-mail inválido'),
        description: z.string(),
        created_by: z.string().uuid('ID do criador inválido'),
    });
    getByDelete = z.object({
        id: z.string().uuid(),
    });
}
export const systemValidation = new SystemValidation();
