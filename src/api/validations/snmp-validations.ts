import { z } from 'zod';

export const snmpConfigSchema = z.object({
    host: z.string().min(1),
    port: z.number().int().min(1).max(65535).default(161),
    community: z.string().min(1),
    version: z.enum(['1', '2c', '3']).default('2c'),
    oids: z.array(z.string()).min(1),
    timeout: z.number().int().min(1000).max(30000).default(5000),
    retries: z.number().int().min(0).max(5).default(3),
});

export const createSystemSchema = z.object({
    name: z.string().min(1),
    host: z.string().min(1),
    alert_email: z.string().email(),
    monitors: z
        .array(
            z.object({
                type: z.literal('SNMP'),
                config: snmpConfigSchema,
                interval: z.number().int().min(30).max(3600).default(120),
            }),
        )
        .min(1),
});

export type SnmpConfigInput = z.infer<typeof snmpConfigSchema>;
export type CreateSystemInput = z.infer<typeof createSystemSchema>;
