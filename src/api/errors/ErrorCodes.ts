export const ERROR_CODES = {
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    INVALID_UUID: 'INVALID_UUID',
    INVALID_EMAIL: 'INVALID_EMAIL',

    // System Errors
    SYSTEM_ALREADY_EXISTS: 'SYSTEM_ALREADY_EXISTS',
    SYSTEM_NOT_FOUND: 'SYSTEM_NOT_FOUND',
    SYSTEM_CREATE_FAILED: 'SYSTEM_CREATE_FAILED',
    SYSTEM_DELETE_FAILED: 'SYSTEM_DELETE_FAILED',
    SYSTEM_UPDATE_FAILED: 'SYSTEM_UPDATE_FAILED',

    // Database Errors
    DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
    DATABASE_QUERY_ERROR: 'DATABASE_QUERY_ERROR',

    // General Errors
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
} as const;

export const ERROR_MESSAGES = {
    [ERROR_CODES.VALIDATION_FAILED]: 'A validação falhou',
    [ERROR_CODES.INVALID_UUID]: 'ID fornecido é inválido',
    [ERROR_CODES.INVALID_EMAIL]: 'E-mail fornecido é inválido',

    [ERROR_CODES.SYSTEM_ALREADY_EXISTS]: 'Esse sistema já está cadastrado',
    [ERROR_CODES.SYSTEM_NOT_FOUND]: 'Sistema não encontrado',
    [ERROR_CODES.SYSTEM_CREATE_FAILED]: 'Falha ao criar sistema',
    [ERROR_CODES.SYSTEM_DELETE_FAILED]:
        'Falha ao eliminar sistema. Tente novamente',
    [ERROR_CODES.SYSTEM_UPDATE_FAILED]: 'Falha ao atualizar sistema',

    [ERROR_CODES.DATABASE_CONNECTION_ERROR]:
        'Erro de conexão com banco de dados',
    [ERROR_CODES.DATABASE_QUERY_ERROR]: 'Erro na consulta ao banco de dados',

    [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Erro interno no servidor',
    [ERROR_CODES.UNAUTHORIZED]: 'Não autorizado',
    [ERROR_CODES.FORBIDDEN]: 'Acesso negado',
} as const;
