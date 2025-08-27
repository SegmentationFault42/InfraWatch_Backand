// swagger/user.swagger.ts

export const LoginSwaggerSchema = {
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
            password: { 
                type: 'string', 
                description: 'Senha do usuário',
                minLength: 1
            },
        },
        required: ['email', 'password'],
    },
    response: {
        200: {
            description: 'Login bem-sucedido',
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Login realizado com sucesso' },
                data: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', description: 'JWT do usuário' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                name: { type: 'string' },
                                email: { type: 'string', format: 'email' },
                                role: {
                                    type: ['object', 'null'],
                                    properties: {
                                        id: { type: 'string', format: 'uuid' },
                                        nome: { type: 'string' },
                                        description: { type: ['string', 'null'] }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
        400: {
            description: 'Dados inválidos',
            type: 'object',
            properties: { 
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Dados inválidos' },
                errors: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            field: { type: 'string' },
                            message: { type: 'string' }
                        }
                    }
                }
            },
        },
        401: {
            description: 'Credenciais inválidas',
            type: 'object',
            properties: { 
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Credenciais inválidas' },
                code: { type: 'string', example: 'UNAUTHORIZED' }
            },
        },
        500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: { 
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Erro interno do servidor' }
            },
        },
    },
};

export const CreateUserSwaggerSchema = {
    description: 'Cria um novo usuário no sistema',
    tags: ['users'],
    body: {
        type: 'object',
        properties: {
            name: { 
                type: 'string', 
                minLength: 1,
                maxLength: 100,
                description: 'Nome completo do usuário'
            },
            email: { 
                type: 'string', 
                format: 'email',
                description: 'E-mail único do usuário'
            },
            password: { 
                type: 'string',
                minLength: 8,
                description: 'Senha com pelo menos 8 caracteres, contendo maiúscula, minúscula, número e caractere especial'
            },
            roleId: {
                type: 'string',
                format: 'uuid',
                description: 'ID da role do usuário (opcional, padrão será viewer)',
            },
        },
        required: ['name', 'email', 'password'],
    },
    response: {
        201: {
            description: 'Usuário criado com sucesso',
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Usuário criado com sucesso' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        roleId: { type: ['string', 'null'], format: 'uuid' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        role: {
                            type: ['object', 'null'],
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                nome: { type: 'string' },
                                description: { type: ['string', 'null'] }
                            }
                        }
                    }
                }
            },
        },
        400: {
            description: 'Dados inválidos',
            type: 'object',
            properties: { 
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Dados inválidos' },
                errors: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            field: { type: 'string' },
                            message: { type: 'string' }
                        }
                    }
                }
            },
        },
        409: {
            description: 'Conflito - Usuário já existe',
            type: 'object',
            properties: { 
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Usuário já existe com este email' },
                code: { type: 'string', example: 'CONFLICT' }
            },
        },
        500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: { 
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Erro interno do servidor' }
            },
        },
    },
};

export const GetUserSwaggerSchema = {
    description: 'Busca um usuário por ID',
    tags: ['users'],
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'ID único do usuário'
            }
        },
        required: ['id']
    },
    response: {
        200: {
            description: 'Usuário encontrado',
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        roleId: { type: ['string', 'null'], format: 'uuid' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        role: {
                            type: ['object', 'null'],
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                nome: { type: 'string' },
                                description: { type: ['string', 'null'] }
                            }
                        }
                    }
                }
            },
        },
        400: {
            description: 'ID inválido',
            type: 'object',
            properties: { 
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'ID inválido' }
            },
        },
        404: {
            description: 'Usuário não encontrado',
            type: 'object',
            properties: { 
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Usuário não encontrado' },
                code: { type: 'string', example: 'NOT_FOUND' }
            },
        },
        500: {
            description: 'Erro interno do servidor',
            type: 'object',
            properties: { 
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Erro interno do servidor' }
            },
        },
    },
};