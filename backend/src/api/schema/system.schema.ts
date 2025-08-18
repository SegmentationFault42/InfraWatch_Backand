export const CreateSystemSwaggerSchema = {
    description: 'Cria um novo sistema para monitoramento',
    tags: ['systems'],
    body: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Nome do sistema' },
            url: {
                type: 'string',
                format: 'uri',
                description: 'URL a ser monitorada',
            },
            monitor_type: {
                type: 'string',
                enum: ['http', 'https', 'ping', 'tcp'],
                description: 'Tipo de monitoramento',
            },
            check_interval: {
                type: 'integer',
                minimum: 1,
                description: 'Intervalo de checagem em segundos',
            },
            timeout: {
                type: 'integer',
                minimum: 1,
                description: 'Tempo limite da checagem em segundos',
            },
            is_enabled: {
                type: 'boolean',
                default: true,
                description: 'Define se o sistema está ativo',
            },
            alert_email: {
                type: 'string',
                format: 'email',
                nullable: true,
                description: 'Email para envio de alertas',
            },
            description: {
                type: 'string',
                nullable: true,
                description: 'Descrição do sistema',
            },
            created_by: {
                type: 'string',
                format: 'uuid',
                nullable: true,
                description: 'ID do usuário que criou o sistema',
            },
        },
        required: [
            'name',
            'url',
            'monitor_type',
            'check_interval',
            'timeout',
            'is_enabled',
        ],
    },
    response: {
        201: {
            description: 'Sistema criado com sucesso',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Sistema criado com sucesso',
                },
            },
        },
        400: {
            description: 'Falha de validação',
            type: 'object',
            properties: {
                error: { type: 'string', example: 'Validação falhou' },
            },
        },
        500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
                error: { type: 'string', example: 'Erro interno no servidor.' },
            },
        },
    },
};
