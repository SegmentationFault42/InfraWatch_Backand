"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingController = pingController;
const ping_service_1 = require("../../ping/ping.service");
const ping_validation_1 = require("../validations/ping.validation");
async function pingController(request, reply) {
    const parseResult = ping_validation_1.pingParamSchema.safeParse(request.params.host);
    if (!parseResult.success) {
        const firstErrorMessage = parseResult.error.issues?.[0]?.message || 'Invalid host parameter';
        return reply.status(400).send({ error: firstErrorMessage });
    }
    const hosts = parseResult.data;
    try {
        const results = await (0, ping_service_1.pingMultipleHosts)(hosts, {
            retries: 3,
            timeoutMs: 2000,
        });
        return reply.send(results.map((result) => ({
            target: result.target,
            reachable: result.alive,
            retriesUsed: result.attempts - 1,
            averageLatency: result.latency ?? null,
        })));
    }
    catch {
        return reply
            .status(504)
            .send({ error: 'Ping request timed out or host unreachable' });
    }
}
//# sourceMappingURL=ping.controller.js.map