import { z } from 'zod';
declare class SystemValidation {
    createSystemSchema: z.ZodObject<{
        name: z.ZodString;
        host: z.ZodString;
        alert_email: z.ZodString;
        monitors: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<{
                PING: "PING";
                API: "API";
                SNMP: "SNMP";
                WEBHOOK: "WEBHOOK";
            }>;
            config: z.ZodAny;
            interval: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
        slaConfig: z.ZodOptional<z.ZodObject<{
            uptimeTarget: z.ZodNumber;
            maxDowntime: z.ZodOptional<z.ZodNumber>;
            responseTimeTarget: z.ZodOptional<z.ZodNumber>;
            monitoringWindow: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    getById: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    getByUpdate: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        host: z.ZodOptional<z.ZodString>;
        alert_email: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            warning: "warning";
            unknown: "unknown";
            up: "up";
            down: "down";
        }>>;
    }, z.core.$strip>;
}
export declare const systemValidation: SystemValidation;
export {};
//# sourceMappingURL=system.validation.d.ts.map