import { z } from 'zod';

export const apiConfigSchema = z.object({
    url: z.string().url(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
    timeout: z.number().min(100),
    expectedStatus: z.number(),
    expectedResponse: z.any().optional(),
});
