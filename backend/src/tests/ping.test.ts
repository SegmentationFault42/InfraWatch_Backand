import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { FastifyInstance } from 'fastify';
import { app } from '../app.js';

let server: FastifyInstance;

beforeAll(async () => {
    server = app;
    await server.ready();
});

afterAll(async () => {
    await server.close();
});

describe('Ping endpoint', () => {
    it('Deve responder com dados de ping válidos para um host existente', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/ping/google.com',
        });

        expect(response.statusCode).toBe(200);

        const body = response.json();

        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);

        const firstResult = body[0];
        expect(firstResult).toHaveProperty('target', 'google.com');
        expect(firstResult).toHaveProperty('reachable');
        expect(typeof firstResult.reachable).toBe('boolean');
        expect(firstResult).toHaveProperty('retriesUsed');
        expect(firstResult).toHaveProperty('averageLatency');
    });

    it('Deve retornar 400 para host inválido', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/ping/???',
        });

        expect(response.statusCode).toBe(400);

        const body = response.json();
        expect(body).toHaveProperty('error');
        expect(typeof body.error).toBe('string');
    });

    it('Deve retornar reachable = false para host inexistente', async () => {
        const hostInexistente = 'algumhostquenaoexiste12345.com';

        const response = await server.inject({
            method: 'GET',
            url: `/ping/${hostInexistente}`,
        });

        expect(response.statusCode).toBe(200);

        const body = response.json();

        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(1);

        const result = body[0];
        expect(result).toHaveProperty('target', hostInexistente);
        expect(result).toHaveProperty('reachable', false);
        expect(result).toHaveProperty('retriesUsed');
        expect(result).toHaveProperty('averageLatency');
    });

    it('Deve responder com dados de ping válidos para múltiplos hosts', async () => {
        const hosts = 'google.com,8.8.8.8,example.com';

        const response = await server.inject({
            method: 'GET',
            url: `/ping/${hosts}`,
        });

        expect(response.statusCode).toBe(200);

        const body = response.json();

        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(3);

        body.forEach((result: any, i: number) => {
            const expectedTarget = hosts.split(',')[i];
            expect(result).toHaveProperty('target', expectedTarget);
            expect(result).toHaveProperty('reachable');
            expect(typeof result.reachable).toBe('boolean');
            expect(result).toHaveProperty('retriesUsed');
            expect(result).toHaveProperty('averageLatency');
        });
    });

    it('Deve retornar 400 para host vazio ou somente espaços', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/ping/   ', // host só com espaços
        });

        expect(response.statusCode).toBe(400);

        const body = response.json();
        expect(body).toHaveProperty('error');
        expect(typeof body.error).toBe('string');
    });

    it('Deve retornar 400 quando o parâmetro host estiver vazio', async () => {
        const response = await server.inject({
            method: 'GET',
            url: `/ping/`,
        });

        expect(response.statusCode).toBe(400);

        const body = response.json();
        expect(body).toHaveProperty('error');
        expect(typeof body.error).toBe('string');
    });

    it('Deve responder com dados de ping válidos para múltiplos hosts', async () => {
        const hosts = 'google.com,8.8.8.8,example.com';

        const response = await server.inject({
            method: 'GET',
            url: `/ping/${hosts}`,
        });

        expect(response.statusCode).toBe(200);

        const body = response.json();
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(1);

        for (const result of body) {
            expect(result).toHaveProperty('target');
            expect(result).toHaveProperty('reachable');
            expect(result).toHaveProperty('retriesUsed');
            expect(result).toHaveProperty('averageLatency');
        }
    }, 10000); // timeout em ms

    it('Deve retornar reachable = false para IP inválido', async () => {
        const invalidIp = '999.999.999.999';

        const response = await server.inject({
            method: 'GET',
            url: `/ping/${invalidIp}`,
        });

        expect(response.statusCode).toBe(200);

        const body = response.json();

        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(1);

        const result = body[0];
        expect(result).toHaveProperty('target', invalidIp);
        expect(result).toHaveProperty('reachable', false);
        expect(result).toHaveProperty('retriesUsed');
        expect(result).toHaveProperty('averageLatency');
    });

    it('Deve retornar erro para múltiplos hosts quando um é inválido', async () => {
        const hosts = 'google.com,invalid_host,8.8.8.8';

        const response = await server.inject({
            method: 'GET',
            url: `/ping/${hosts}`,
        });

        expect(response.statusCode).toBe(400);
        const body = response.json();
        expect(body).toHaveProperty('error');
    });

    it('Deve responder com reachable = true para localhost', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/ping/localhost',
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(1);

        const result = body[0];
        expect(result).toHaveProperty('target', 'localhost');
        expect(result).toHaveProperty('reachable', true);
        expect(result).toHaveProperty('retriesUsed');
        expect(result).toHaveProperty('averageLatency');
    });

    it('Deve responder com dados de ping válidos para múltiplos hosts', async () => {
        const hosts = 'google.com,8.8.8.8,example.com';

        const response = await server.inject({
            method: 'GET',
            url: `/ping/${hosts}`,
        });

        expect(response.statusCode).toBe(200);

        const body = response.json();
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(3);

        body.forEach((result: any, i: number) => {
            const expectedTarget = hosts.split(',')[i];
            expect(result).toHaveProperty('target', expectedTarget);
            expect(result).toHaveProperty('reachable');
            expect(typeof result.reachable).toBe('boolean');
            expect(result).toHaveProperty('retriesUsed');
            expect(result).toHaveProperty('averageLatency');
        });
    }, 20000);
});
