import { FastifyReply, FastifyRequest } from 'fastify';
import { pingMultipleHosts } from '../../ping/ping.service';
import { pingParamSchema } from '../validations/ping.validation';

export async function pingController(
    request: FastifyRequest<{ Params: { host: string } }>,
    reply: FastifyReply,
) {
    const parseResult = pingParamSchema.safeParse(request.params.host);

    if (!parseResult.success) {
        const firstErrorMessage =
            parseResult.error.issues?.[0]?.message || 'Invalid host parameter';
        return reply.status(400).send({ error: firstErrorMessage });
    }

    const hosts = parseResult.data;

    try {
        const results = await pingMultipleHosts(hosts, {
            retries: 3,
            timeoutMs: 2000,
        });

        return reply.send(
            results.map((result) => ({
                target: result.target,
                reachable: result.alive,
                retriesUsed: result.attempts - 1,
                averageLatency: result.latency ?? null,
            })),
        );
    } catch {
        return reply
            .status(504)
            .send({ error: 'Ping request timed out or host unreachable' });
    }
}
