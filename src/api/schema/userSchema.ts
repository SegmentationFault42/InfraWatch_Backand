export const LoginSchemaSwagger = {
    description: 'Realiza login de um usuário',
    tags: ['users'],
    body: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'E-mail do usuário',
            },
            senha: { type: 'string', description: 'Senha do usuário' },
        },
        required: ['email', 'senha'],
    },
    response: {
        200: {
            description: 'Login bem-sucedido',
            type: 'object',
            properties: {
                token: { type: 'string', description: 'JWT do usuário' },
            },
        },
        400: {
            description: 'Credenciais inválidas',
            type: 'object',
            properties: { message: { type: 'string' } },
        },
        500: {
            description: 'Erro interno',
            type: 'object',
            properties: { message: { type: 'string' } },
        },
    },
};
export const CreateUserSwaggerSchema = {
    description: 'Cria um novo usuário no sistema',
    tags: ['users'],
    body: {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },
            senha: { type: 'string' },
            first_name: { type: 'string', maxLength: 50 },
            last_name: { type: 'string', maxLength: 50 },
            profile_image_url: {
                type: ['string', 'null'],
                format: 'uri',
            },
            role: {
                type: 'string',
                enum: ['viewer', 'admin', 'editor'],
                default: 'viewer',
            },
        },
        required: ['email', 'senha', 'first_name', 'last_name'],
    },
    response: {
        201: {
            description: 'Usuário criado com sucesso',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Usuario criado com sucesso',
                },
            },
        },
        400: {
            description: 'Falha de validação',
            type: 'object',
            properties: { error: { type: 'string' } },
        },
        500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: { error: { type: 'string' } },
        },
    },
};
