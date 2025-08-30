"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingRouteSchema = void 0;
exports.pingRouteSchema = {
    description: 'Test connectivity to one or more hosts via ping',
    tags: ['ping'],
    params: {
        type: 'object',
        properties: {
            host: {
                type: 'string',
                description: 'One or more hosts (IP or domain) separated by commas',
            },
        },
        required: ['host'],
    },
    response: {
        200: {
            description: 'Ping results for each host',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    target: { type: 'string' },
                    reachable: { type: 'boolean' },
                    retriesUsed: { type: 'number' },
                    averageLatency: { type: ['number', 'null'] },
                },
            },
        },
        400: {
            description: 'Invalid host parameter',
            type: 'object',
            properties: { error: { type: 'string' } },
        },
        504: {
            description: 'Ping request timed out or host unreachable',
            type: 'object',
            properties: { error: { type: 'string' } },
        },
    },
};
//# sourceMappingURL=ping.schema.js.map