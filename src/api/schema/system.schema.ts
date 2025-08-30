export const CreateSystemSwaggerSchema = {
    description: 'Cria um novo sistema para monitoramento',
    tags: ['systems'],
    body: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                description: 'Nome do sistema',
                minLength: 1,
            },
            host: {
                type: 'string',
                description: 'Host ou IP do sistema a ser monitorado',
                minLength: 1,
            },
            alert_email: {
                type: 'string',
                format: 'email',
                description: 'Email para envio de alertas',
            },
            monitors: {
                type: 'array',
                description: 'Lista de monitores para o sistema',
                items: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            enum: ['API', 'PING', 'SNMP', 'WEBHOOK'],
                            description: 'Tipo de monitor',
                        },
                        config: {
                            type: 'object',
                            description: 'Configurações específicas do monitor',
                            additionalProperties: true,
                        },
                        interval: {
                            type: 'integer',
                            minimum: 1,
                            description: 'Intervalo de checagem em segundos',
                        },
                    },
                    required: ['type', 'config'],
                },
                nullable: true,
            },
            slaConfig: {
                type: 'object',
                description: 'Configurações de SLA para o sistema',
                properties: {
                    uptimeTarget: {
                        type: 'number',
                        minimum: 0,
                        maximum: 100,
                        description: 'Meta de uptime em porcentagem (ex: 99.9)',
                    },
                    maxDowntime: {
                        type: 'integer',
                        minimum: 0,
                        description:
                            'Tempo máximo de downtime permitido em minutos',
                    },
                    responseTimeTarget: {
                        type: 'integer',
                        minimum: 1,
                        description: 'Tempo de resposta alvo em milissegundos',
                    },
                    monitoringWindow: {
                        type: 'string',
                        description:
                            'Janela de monitoramento (ex: "monthly", "quarterly")',
                        enum: [
                            'daily',
                            'weekly',
                            'monthly',
                            'quarterly',
                            'yearly',
                        ],
                    },
                },
                required: ['uptimeTarget'],
                nullable: true,
            },
        },
        required: ['name', 'host', 'alert_email'],
        additionalProperties: false,
    },
    response: {
        201: {
            description: 'Sistema criado com sucesso',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Sistema adicionado com sucesso',
                },
                data: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID único do sistema',
                        },
                        name: {
                            type: 'string',
                            description: 'Nome do sistema',
                        },
                        host: {
                            type: 'string',
                            description: 'Host do sistema',
                        },
                        alert_email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email para alertas',
                        },
                        status: {
                            type: 'string',
                            enum: ['up', 'down', 'warning', 'unknown'],
                            description: 'Status atual do sistema',
                        },
                        monitors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', format: 'uuid' },
                                    type: {
                                        type: 'string',
                                        enum: [
                                            'API',
                                            'PING',
                                            'SNMP',
                                            'WEBHOOK',
                                        ],
                                    },
                                    config: { type: 'object' },
                                    interval: { type: 'integer' },
                                },
                            },
                        },
                        SLAConfig: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', format: 'uuid' },
                                    uptimeTarget: { type: 'number' },
                                    maxDowntime: { type: 'integer' },
                                    responseTimeTarget: { type: 'integer' },
                                    monitoringWindow: { type: 'string' },
                                },
                            },
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data da última atualização',
                        },
                    },
                },
            },
        },
        400: {
            description: 'Falha de validação ou sistema já existe',
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    examples: [
                        'A validação falhou',
                        'Esse sistema já está cadastrado',
                    ],
                },
                details: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            code: { type: 'string' },
                            expected: { type: 'string' },
                            received: { type: 'string' },
                            path: { type: 'array', items: { type: 'string' } },
                            message: { type: 'string' },
                        },
                    },
                    description:
                        'Detalhes dos erros de validação (quando aplicável)',
                },
                code: {
                    type: 'string',
                    description: 'Código do erro para identificação',
                },
            },
        },
        500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: 'Erro interno no servidor',
                },
                message: {
                    type: 'string',
                    example: 'Algo deu errado, tente novamente mais tarde.',
                },
                code: {
                    type: 'string',
                    example: 'INTERNAL_SERVER_ERROR',
                },
            },
        },
    },
};

export const GetAllSystemsSwaggerSchema = {
    description: 'Busca todos os sistemas cadastrados',
    tags: ['systems'],
    response: {
        200: {
            description: 'Lista de sistemas',
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            name: { type: 'string' },
                            host: { type: 'string' },
                            status: {
                                type: 'string',
                                enum: ['up', 'down', 'warning', 'unknown'],
                            },
                            alert_email: { type: 'string', format: 'email' },
                            monitors: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string', format: 'uuid' },
                                        type: {
                                            type: 'string',
                                            enum: [
                                                'API',
                                                'PING',
                                                'SNMP',
                                                'WEBHOOK',
                                            ],
                                        },
                                        config: { type: 'object' },
                                        interval: { type: 'integer' },
                                    },
                                },
                            },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                        },
                    },
                },
                count: {
                    type: 'integer',
                    description: 'Número total de sistemas',
                },
            },
        },
        500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
                error: { type: 'string' },
                code: { type: 'string' },
            },
        },
    },
};

export const GetSystemByIdSwaggerSchema = {
    description: 'Busca um sistema específico pelo ID',
    tags: ['systems'],
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'ID do sistema',
            },
        },
        required: ['id'],
    },
    response: {
        200: {
            description: 'Sistema encontrado',
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        host: { type: 'string' },
                        alert_email: { type: 'string', format: 'email' },
                        status: {
                            type: 'string',
                            enum: ['up', 'down', 'warning', 'unknown'],
                        },
                        monitors: { type: 'array', items: { type: 'object' } },
                        SLAConfig: { type: 'array', items: { type: 'object' } },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        400: {
            description: 'ID inválido',
            type: 'object',
            properties: {
                error: { type: 'string', example: 'Validação falhou' },
                details: { type: 'array', items: { type: 'object' } },
            },
        },
        404: {
            description: 'Sistema não encontrado',
            type: 'object',
            properties: {
                error: { type: 'string', example: 'Sistema não encontrado' },
                code: { type: 'string', example: 'SYSTEM_NOT_FOUND' },
            },
        },
        500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
                error: { type: 'string' },
                code: { type: 'string' },
            },
        },
    },
};

export const UpdateSystemSwaggerSchema = {
    description: 'Atualiza um sistema existente',
    tags: ['systems'],
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'ID do sistema',
            },
        },
        required: ['id'],
    },
    body: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 1,
                description: 'Nome do sistema',
            },
            host: {
                type: 'string',
                minLength: 1,
                description: 'Host do sistema',
            },
            alert_email: {
                type: 'string',
                format: 'email',
                description: 'Email para alertas',
            },
            status: {
                type: 'string',
                enum: ['up', 'down', 'warning', 'unknown'],
                description: 'Status do sistema',
            },
        },
        additionalProperties: false,
    },
    response: {
        200: {
            description: 'Sistema atualizado com sucesso',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Sistema atualizado com sucesso',
                },
                data: {
                    type: 'object',
                    description: 'Dados do sistema atualizado',
                },
            },
        },
        400: {
            description: 'Dados inválidos',
            type: 'object',
            properties: {
                error: { type: 'string' },
                details: { type: 'array' },
            },
        },
        404: {
            description: 'Sistema não encontrado',
            type: 'object',
            properties: {
                error: { type: 'string' },
                code: { type: 'string' },
            },
        },
        500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
                error: { type: 'string' },
                code: { type: 'string' },
            },
        },
    },
};

export const DeleteSystemSwaggerSchema = {
    description: 'Remove um sistema',
    tags: ['systems'],
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'ID do sistema',
            },
        },
        required: ['id'],
    },
    response: {
        200: {
            description: 'Sistema removido com sucesso',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Sistema removido com sucesso',
                },
            },
        },
        400: {
            description: 'ID inválido',
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
        404: {
            description: 'Sistema não encontrado',
            type: 'object',
            properties: {
                error: { type: 'string' },
                code: { type: 'string' },
            },
        },
        500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
    },
};
