// src/routes/sla.routes.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SLAController } from '../controllers/sla.controller';

export async function slaRoutes(
  fastify: FastifyInstance, 
  options: FastifyPluginOptions
): Promise<void> {
  const slaController = new SLAController();

  // Hook para cleanup quando o servidor for fechado
  fastify.addHook('onClose', async () => {
    await slaController.cleanup();
  });

  // Schemas para validação e documentação
  const systemIdParamSchema = {
    type: 'object',
    required: ['systemId'],
    properties: {
      systemId: { 
        type: 'string', 
        format: 'uuid',
        description: 'ID único do sistema'
      }
    }
  } as const;

  const slaConfigBodySchema = {
    type: 'object',
    required: ['uptimeTarget'],
    properties: {
      uptimeTarget: { 
        type: 'number', 
        minimum: 0, 
        maximum: 100,
        description: 'Percentual de uptime alvo (0-100)'
      },
      maxDowntime: { 
        type: 'number', 
        minimum: 0,
        description: 'Tempo máximo de inatividade em minutos'
      },
      responseTimeTarget: { 
        type: 'number', 
        minimum: 0,
        description: 'Tempo de resposta alvo em milissegundos'
      },
      monitoringWindow: { 
        type: 'string',
        enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
        description: 'Janela de monitoramento'
      }
    },
    additionalProperties: false
  } as const;

  const slaUpdateBodySchema = {
    type: 'object',
    properties: {
      uptimeTarget: { 
        type: 'number', 
        minimum: 0, 
        maximum: 100 
      },
      maxDowntime: { 
        type: 'number', 
        minimum: 0 
      },
      responseTimeTarget: { 
        type: 'number', 
        minimum: 0 
      },
      monitoringWindow: { 
        type: 'string',
        enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
      }
    },
    additionalProperties: false
  } as const;

  const slaOverviewResponseSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      systemId: { type: 'string' },
      systemName: { type: 'string' },
      systemHost: { type: 'string' },
      systemStatus: { type: 'string' },
      uptimeTarget: { type: 'number' },
      currentUptime: { type: 'number' },
      status: { 
        type: 'string', 
        enum: ['compliant', 'at_risk', 'breach', 'no_data'] 
      },
      timeToBreach: { type: 'number', nullable: true },
      downtime: { type: 'number' },
      totalChecks: { type: 'number' },
      successfulChecks: { type: 'number' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  } as const;

  // GET /api/sla - SLAs de todos os sistemas (RF06)
  fastify.get('/', {
    schema: {
      tags: ['SLA'],
      summary: 'Listar SLAs de todos os sistemas',
      description: 'Retorna uma lista com os SLAs configurados para todos os sistemas',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: slaOverviewResponseSchema
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                compliant: { type: 'number' },
                atRisk: { type: 'number' },
                breached: { type: 'number' }
              }
            }
          }
        },
        500: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    }
  }, slaController.getAllSLAs.bind(slaController));

  // GET /api/sla/:systemId - SLA específico do sistema
  fastify.get('/:systemId', {
    schema: {
      tags: ['SLA'],
      summary: 'Obter SLA de um sistema específico',
      description: 'Retorna os detalhes do SLA configurado para um sistema',
      params: systemIdParamSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              anyOf: [
                slaOverviewResponseSchema,
                { type: 'null' }
              ]
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'null' },
            message: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    }
  }, slaController.getSLABySystemId.bind(slaController));

  // PUT /api/sla/:systemId - Configurar SLA do sistema
  fastify.put('/:systemId', {
    schema: {
      tags: ['SLA'],
      summary: 'Configurar SLA de um sistema',
      description: 'Cria ou atualiza a configuração de SLA para um sistema',
      params: systemIdParamSchema,
      body: slaConfigBodySchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: slaOverviewResponseSchema,
            message: { type: 'string' }
          }
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            code: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    }
  }, slaController.configureSLA.bind(slaController));

  // PATCH /api/sla/:systemId - Atualizar SLA do sistema
  fastify.patch('/:systemId', {
    schema: {
      tags: ['SLA'],
      summary: 'Atualizar SLA de um sistema',
      description: 'Atualiza parcialmente a configuração de SLA para um sistema',
      params: systemIdParamSchema,
      body: slaUpdateBodySchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: slaOverviewResponseSchema,
            message: { type: 'string' }
          }
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            code: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    }
  }, slaController.updateSLA.bind(slaController));

  // GET /api/sla/:systemId/history - Histórico de SLA
  fastify.get('/:systemId/history', {
    schema: {
      tags: ['SLA'],
      summary: 'Obter histórico de SLA de um sistema',
      description: 'Retorna o histórico de relatórios de SLA para um sistema',
      params: systemIdParamSchema,
      querystring: {
        type: 'object',
        properties: {
          limit: { 
            type: 'string',
            pattern: '^[0-9]+$',
            description: 'Número máximo de registros (padrão: 12)'
          },
          startDate: { 
            type: 'string', 
            format: 'date',
            description: 'Data de início (YYYY-MM-DD)'
          },
          endDate: { 
            type: 'string', 
            format: 'date',
            description: 'Data de fim (YYYY-MM-DD)'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  systemId: { type: 'string' },
                  systemName: { type: 'string' },
                  periodStart: { type: 'string', format: 'date-time' },
                  periodEnd: { type: 'string', format: 'date-time' },
                  uptimePct: { type: 'number' },
                  downtime: { type: 'number' },
                  incidents: { type: 'number' },
                  createdAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                hasMore: { type: 'boolean' }
              }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    }
  }, slaController.getSLAHistory.bind(slaController));

  // GET /api/sla/reports/monthly - Relatório mensal de SLA
  fastify.get('/reports/monthly', {
    schema: {
      tags: ['SLA'],
      summary: 'Obter relatório mensal de SLA',
      description: 'Retorna um relatório consolidado de SLA para um período mensal',
      querystring: {
        type: 'object',
        properties: {
          month: { 
            type: 'string', 
            format: 'date',
            description: 'Mês do relatório (YYYY-MM-DD)'
          },
          year: { 
            type: 'string',
            pattern: '^[0-9]{4}$',
            description: 'Ano do relatório'
          },
          systemIds: { 
            type: 'string',
            description: 'IDs dos sistemas separados por vírgula'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                reportMonth: { type: 'string', format: 'date-time' },
                totalSystems: { type: 'number' },
                compliantSystems: { type: 'number' },
                atRiskSystems: { type: 'number' },
                breachedSystems: { type: 'number' },
                averageUptime: { type: 'number' },
                totalDowntime: { type: 'number' },
                worstPerformer: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    systemId: { type: 'string' },
                    systemName: { type: 'string' },
                    uptimePercentage: { type: 'number' },
                    downtime: { type: 'number' }
                  }
                },
                bestPerformer: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    systemId: { type: 'string' },
                    systemName: { type: 'string' },
                    uptimePercentage: { type: 'number' },
                    downtime: { type: 'number' }
                  }
                },
                reports: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      systemId: { type: 'string' },
                      systemName: { type: 'string' },
                      systemHost: { type: 'string' },
                      uptimePct: { type: 'number' },
                      downtime: { type: 'number' },
                      incidents: { type: 'number' },
                      status: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, slaController.getMonthlySLAReport.bind(slaController));
}