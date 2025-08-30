"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_js_1 = require("../app.js");
let server;
(0, vitest_1.beforeAll)(async () => {
    server = app_js_1.app;
    await server.ready();
});
(0, vitest_1.afterAll)(async () => {
    await server.close();
});
(0, vitest_1.describe)('Ping endpoint', () => {
    (0, vitest_1.it)('Deve responder com dados de ping válidos para um host existente', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/ping/google.com',
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const body = response.json();
        (0, vitest_1.expect)(Array.isArray(body)).toBe(true);
        (0, vitest_1.expect)(body.length).toBeGreaterThan(0);
        const firstResult = body[0];
        (0, vitest_1.expect)(firstResult).toHaveProperty('target', 'google.com');
        (0, vitest_1.expect)(firstResult).toHaveProperty('reachable');
        (0, vitest_1.expect)(typeof firstResult.reachable).toBe('boolean');
        (0, vitest_1.expect)(firstResult).toHaveProperty('retriesUsed');
        (0, vitest_1.expect)(firstResult).toHaveProperty('averageLatency');
    });
    (0, vitest_1.it)('Deve retornar 400 para host inválido', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/ping/???',
        });
        (0, vitest_1.expect)(response.statusCode).toBe(400);
        const body = response.json();
        (0, vitest_1.expect)(body).toHaveProperty('error');
        (0, vitest_1.expect)(typeof body.error).toBe('string');
    });
    (0, vitest_1.it)('Deve retornar reachable = false para host inexistente', async () => {
        const hostInexistente = 'algumhostquenaoexiste12345.com';
        const response = await server.inject({
            method: 'GET',
            url: `/ping/${hostInexistente}`,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const body = response.json();
        (0, vitest_1.expect)(Array.isArray(body)).toBe(true);
        (0, vitest_1.expect)(body.length).toBe(1);
        const result = body[0];
        (0, vitest_1.expect)(result).toHaveProperty('target', hostInexistente);
        (0, vitest_1.expect)(result).toHaveProperty('reachable', false);
        (0, vitest_1.expect)(result).toHaveProperty('retriesUsed');
        (0, vitest_1.expect)(result).toHaveProperty('averageLatency');
    });
    (0, vitest_1.it)('Deve responder com dados de ping válidos para múltiplos hosts', async () => {
        const hosts = 'google.com,8.8.8.8,example.com';
        const response = await server.inject({
            method: 'GET',
            url: `/ping/${hosts}`,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const body = response.json();
        (0, vitest_1.expect)(Array.isArray(body)).toBe(true);
        (0, vitest_1.expect)(body.length).toBe(3);
        body.forEach((result, i) => {
            const expectedTarget = hosts.split(',')[i];
            (0, vitest_1.expect)(result).toHaveProperty('target', expectedTarget);
            (0, vitest_1.expect)(result).toHaveProperty('reachable');
            (0, vitest_1.expect)(typeof result.reachable).toBe('boolean');
            (0, vitest_1.expect)(result).toHaveProperty('retriesUsed');
            (0, vitest_1.expect)(result).toHaveProperty('averageLatency');
        });
    });
    (0, vitest_1.it)('Deve retornar 400 para host vazio ou somente espaços', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/ping/   ', // host só com espaços
        });
        (0, vitest_1.expect)(response.statusCode).toBe(400);
        const body = response.json();
        (0, vitest_1.expect)(body).toHaveProperty('error');
        (0, vitest_1.expect)(typeof body.error).toBe('string');
    });
    (0, vitest_1.it)('Deve retornar 400 quando o parâmetro host estiver vazio', async () => {
        const response = await server.inject({
            method: 'GET',
            url: `/ping/`,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(400);
        const body = response.json();
        (0, vitest_1.expect)(body).toHaveProperty('error');
        (0, vitest_1.expect)(typeof body.error).toBe('string');
    });
    (0, vitest_1.it)('Deve responder com dados de ping válidos para múltiplos hosts', async () => {
        const hosts = 'google.com,8.8.8.8,example.com';
        const response = await server.inject({
            method: 'GET',
            url: `/ping/${hosts}`,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const body = response.json();
        (0, vitest_1.expect)(Array.isArray(body)).toBe(true);
        (0, vitest_1.expect)(body.length).toBeGreaterThan(1);
        for (const result of body) {
            (0, vitest_1.expect)(result).toHaveProperty('target');
            (0, vitest_1.expect)(result).toHaveProperty('reachable');
            (0, vitest_1.expect)(result).toHaveProperty('retriesUsed');
            (0, vitest_1.expect)(result).toHaveProperty('averageLatency');
        }
    }, 10000); // timeout em ms
    (0, vitest_1.it)('Deve retornar reachable = false para IP inválido', async () => {
        const invalidIp = '999.999.999.999';
        const response = await server.inject({
            method: 'GET',
            url: `/ping/${invalidIp}`,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const body = response.json();
        (0, vitest_1.expect)(Array.isArray(body)).toBe(true);
        (0, vitest_1.expect)(body.length).toBe(1);
        const result = body[0];
        (0, vitest_1.expect)(result).toHaveProperty('target', invalidIp);
        (0, vitest_1.expect)(result).toHaveProperty('reachable', false);
        (0, vitest_1.expect)(result).toHaveProperty('retriesUsed');
        (0, vitest_1.expect)(result).toHaveProperty('averageLatency');
    });
    (0, vitest_1.it)('Deve retornar erro para múltiplos hosts quando um é inválido', async () => {
        const hosts = 'google.com,invalid_host,8.8.8.8';
        const response = await server.inject({
            method: 'GET',
            url: `/ping/${hosts}`,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(400);
        const body = response.json();
        (0, vitest_1.expect)(body).toHaveProperty('error');
    });
    (0, vitest_1.it)('Deve responder com reachable = true para localhost', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/ping/localhost',
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const body = response.json();
        (0, vitest_1.expect)(Array.isArray(body)).toBe(true);
        (0, vitest_1.expect)(body.length).toBe(1);
        const result = body[0];
        (0, vitest_1.expect)(result).toHaveProperty('target', 'localhost');
        (0, vitest_1.expect)(result).toHaveProperty('reachable', true);
        (0, vitest_1.expect)(result).toHaveProperty('retriesUsed');
        (0, vitest_1.expect)(result).toHaveProperty('averageLatency');
    });
    (0, vitest_1.it)('Deve responder com dados de ping válidos para múltiplos hosts', async () => {
        const hosts = 'google.com,8.8.8.8,example.com';
        const response = await server.inject({
            method: 'GET',
            url: `/ping/${hosts}`,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const body = response.json();
        (0, vitest_1.expect)(Array.isArray(body)).toBe(true);
        (0, vitest_1.expect)(body.length).toBe(3);
        body.forEach((result, i) => {
            const expectedTarget = hosts.split(',')[i];
            (0, vitest_1.expect)(result).toHaveProperty('target', expectedTarget);
            (0, vitest_1.expect)(result).toHaveProperty('reachable');
            (0, vitest_1.expect)(typeof result.reachable).toBe('boolean');
            (0, vitest_1.expect)(result).toHaveProperty('retriesUsed');
            (0, vitest_1.expect)(result).toHaveProperty('averageLatency');
        });
    }, 20000);
});
//# sourceMappingURL=ping.test.js.map