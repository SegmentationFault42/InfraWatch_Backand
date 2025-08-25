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

export const GetAllSystemsSwaggerSchema = {
    description: 'Lista todos os sistemas monitorados',
    tags: ['systems'],
    response: {
        200: {
            description: 'Lista de sistemas retornada com sucesso',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    url: { type: 'string', format: 'uri' },
                    monitor_type: {
                        type: 'string',
                        enum: ['http', 'https', 'ping', 'tcp'],
                    },
                    check_interval: { type: 'integer' },
                    timeout: { type: 'integer' },
                    status: { type: 'string' },
                    is_enabled: { type: 'boolean' },
                    alert_email: {
                        type: 'string',
                        format: 'email',
                        nullable: true,
                    },
                    description: { type: 'string', nullable: true },
                },
            },
            example: [
                {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    name: 'Meu sistema',
                    url: 'https://meuservidor.com',
                    monitor_type: 'https',
                    check_interval: 60,
                    timeout: 5,
                    status: 'online',
                    is_enabled: true,
                    alert_email: 'admin@dominio.com',
                    description: 'API principal de produção',
                },
            ],
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

export const GetSystemByIdSwaggerSchema = {
    description: 'Retorna um sistema monitorado pelo ID',
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
            description: 'Sistema retornado com sucesso',
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                url: { type: 'string', format: 'uri' },
                monitor_type: {
                    type: 'string',
                    enum: ['http', 'https', 'ping', 'tcp'],
                },
                check_interval: { type: 'integer' },
                timeout: { type: 'integer' },
                status: { type: 'string' },
                is_enabled: { type: 'boolean' },
                alert_email: {
                    type: 'string',
                    format: 'email',
                    nullable: true,
                },
                description: { type: 'string', nullable: true },
            },
            example: {
                id: '550e8400-e29b-41d4-a716-446655440000',
                name: 'Meu sistema',
                url: 'https://meuservidor.com',
                monitor_type: 'https',
                check_interval: 60,
                timeout: 5,
                status: 'online',
                is_enabled: true,
                alert_email: 'admin@dominio.com',
                description: 'API principal de produção',
            },
        },
        404: {
            description: 'Sistema não encontrado',
            type: 'object',
            properties: {
                error: { type: 'string', example: 'Sistema não encontrado.' },
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

export const DeleteSystemSwaggerSchema = {
    description: 'Remove um sistema monitorado pelo ID',
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
            description: 'Erro de validação ou sistema não encontrado',
            type: 'object',
            properties: {
                error: { type: 'string', example: 'A validação falhou' },
                message: {
                    type: 'string',
                    example: 'Falha ao eliminar Sistema.\n Tente Novamente',
                },
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

export const UpdateSystemSwaggerSchema = {
    description: 'Atualiza os dados de um sistema existente',
    tags: ['systems'],
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'ID do sistema a ser atualizado',
            },
        },
        required: ['id'],
    },
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
                    example: 'Dados atualizados com sucesso',
                },
            },
        },
        400: {
            description: 'Falha de validação',
            type: 'object',
            properties: {
                error: { type: 'string', example: 'Validação falhou' },
                details: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['name é obrigatório'],
                },
            },
        },
        404: {
            description: 'Sistema não encontrado',
            type: 'object',
            properties: {
                error: { type: 'string', example: 'Sistema não encontrado' },
                message: {
                    type: 'string',
                    example: 'O sistema que você tentou atualizar não existe.',
                },
            },
        },
        500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: {
                error: { type: 'string', example: 'Erro interno no servidor' },
                message: {
                    type: 'string',
                    example: 'Algo deu errado, tente novamente mais tarde.',
                },
            },
        },
    },
};
