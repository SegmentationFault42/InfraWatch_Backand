// src/routes/api-routes.ts
import { FastifyInstance } from 'fastify';
import { apiController } from '../controllers/api-controller';

const testApiConnectionSchema = {
  tags: ['API'],
  summary: 'Testar conexão API',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', description: 'ID do sistema' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['up', 'down', 'warning', 'unknown'] },
            timestamp: { type: 'string', format: 'date-time' },
            responseTime: { type: 'number' },
            statusCode: { type: 'number' },
            endpoint: { type: 'string' },
            payloadSize: { type: 'number' },
            error: { type: 'string' }
          }
        }
      }
    }
  }
};

export async function apiRoutes(fastify: FastifyInstance) {
  // API Operations
  fastify.post(
    '/systems/api/:id/test',
    {
      schema: testApiConnectionSchema,
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    apiController.testApiConnection
  );

  fastify.post(
    '/systems/api/:id/monitor',
    {
      schema: {
        tags: ['API'],
        summary: 'Monitorar sistema via API',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', description: 'ID do sistema' }
          }
        }
      },
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
    },
    apiController.monitorApiSystem
  );

  fastify.post(
    '/systems/api/monitor-all',
    {
      schema: {
        tags: ['API'],
        summary: 'Monitorar todas as APIs'
      },
      config: {
        rateLimit: {
          max: 2,
          timeWindow: '1 minute',
        },
      },
    },
    apiController.monitorAllApiSystems
  );

  fastify.get(
    '/systems/api/:id/metrics',
    {
      schema: {
        tags: ['API'],
        summary: 'Obter métricas do sistema API',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', description: 'ID do sistema' }
          }
        },
        querystring: {
          type: 'object',
          properties: {
            from: { type: 'string', format: 'date-time' },
            to: { type: 'string', format: 'date-time' },
            limit: { type: 'string' }
          }
        }
      },
    },
    apiController.getApiSystemMetrics
  );

  fastify.get(
    '/systems/api/:id/status',
    {
      schema: {
        tags: ['API'],
        summary: 'Obter status completo do sistema API',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', description: 'ID do sistema' }
          }
        }
      },
    },
    apiController.getApiSystemStatus
  );
}