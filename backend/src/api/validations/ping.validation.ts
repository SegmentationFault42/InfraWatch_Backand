import { z } from 'zod';

const ipV4Regex =
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

const ipV6Regex = /^(([0-9a-fA-F]{1,4}):){7}([0-9a-fA-F]{1,4})$/;

const hostnameRegex =
    /^(?=.{1,253}$)(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(\.(?!-)[a-zA-Z0-9-]{1,63}(?<!-))*\.?$/;

const singleHostSchema = z.string().refine(
    (val) => {
        const isHostname = hostnameRegex.test(val);
        const isIpV4 = ipV4Regex.test(val);
        const isIpV6 = ipV6Regex.test(val);
        return isHostname || isIpV4 || isIpV6;
    },
    {
        message: 'Invalid hostname or IP address format',
    },
);

export const pingParamSchema = z
    .string()
    .transform((val) => val.split(',').map((h) => h.trim()))
    .superRefine((hosts, ctx) => {
        if (hosts.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Host list cannot be empty',
            });
            return;
        }
        hosts.forEach((host) => {
            const result = singleHostSchema.safeParse(host);
            if (!result.success) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Invalid host: ${host}`,
                });
            }
        });
    });
