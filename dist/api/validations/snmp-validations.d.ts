import { z } from 'zod';
export declare const snmpConfigSchema: z.ZodObject<{
    host: z.ZodString;
    port: z.ZodDefault<z.ZodNumber>;
    community: z.ZodString;
    version: z.ZodDefault<z.ZodEnum<{
        1: "1";
        3: "3";
        "2c": "2c";
    }>>;
    oids: z.ZodArray<z.ZodString>;
    timeout: z.ZodDefault<z.ZodNumber>;
    retries: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const createSystemSchema: z.ZodObject<{
    name: z.ZodString;
    host: z.ZodString;
    alert_email: z.ZodString;
    monitors: z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<"SNMP">;
        config: z.ZodObject<{
            host: z.ZodString;
            port: z.ZodDefault<z.ZodNumber>;
            community: z.ZodString;
            version: z.ZodDefault<z.ZodEnum<{
                1: "1";
                3: "3";
                "2c": "2c";
            }>>;
            oids: z.ZodArray<z.ZodString>;
            timeout: z.ZodDefault<z.ZodNumber>;
            retries: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>;
        interval: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SnmpConfigInput = z.infer<typeof snmpConfigSchema>;
export type CreateSystemInput = z.infer<typeof createSystemSchema>;
//# sourceMappingURL=snmp-validations.d.ts.map