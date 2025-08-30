"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingParamSchema = void 0;
const zod_1 = require("zod");
const ipV4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
const ipV6Regex = /^(([0-9a-fA-F]{1,4}):){7}([0-9a-fA-F]{1,4})$/;
const hostnameRegex = /^(?=.{1,253}$)(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(\.(?!-)[a-zA-Z0-9-]{1,63}(?<!-))*\.?$/;
const singleHostSchema = zod_1.z.string().refine((val) => {
    const isHostname = hostnameRegex.test(val);
    const isIpV4 = ipV4Regex.test(val);
    const isIpV6 = ipV6Regex.test(val);
    return isHostname || isIpV4 || isIpV6;
}, {
    message: 'Invalid hostname or IP address format',
});
exports.pingParamSchema = zod_1.z
    .string()
    .transform((val) => val.split(',').map((h) => h.trim()))
    .superRefine((hosts, ctx) => {
    if (hosts.length === 0) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Host list cannot be empty',
        });
        return;
    }
    hosts.forEach((host) => {
        const result = singleHostSchema.safeParse(host);
        if (!result.success) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: `Invalid host: ${host}`,
            });
        }
    });
});
//# sourceMappingURL=ping.validation.js.map