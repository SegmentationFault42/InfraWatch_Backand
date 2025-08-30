"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.ERROR_CODES = void 0;
exports.ERROR_CODES = {
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
};
exports.ERROR_MESSAGES = {
    [exports.ERROR_CODES.VALIDATION_FAILED]: 'A validação falhou',
    [exports.ERROR_CODES.INVALID_UUID]: 'ID fornecido é inválido',
    [exports.ERROR_CODES.INVALID_EMAIL]: 'E-mail fornecido é inválido',
    [exports.ERROR_CODES.SYSTEM_ALREADY_EXISTS]: 'Esse sistema já está cadastrado',
    [exports.ERROR_CODES.SYSTEM_NOT_FOUND]: 'Sistema não encontrado',
    [exports.ERROR_CODES.SYSTEM_CREATE_FAILED]: 'Falha ao criar sistema',
    [exports.ERROR_CODES.SYSTEM_DELETE_FAILED]: 'Falha ao eliminar sistema. Tente novamente',
    [exports.ERROR_CODES.SYSTEM_UPDATE_FAILED]: 'Falha ao atualizar sistema',
    [exports.ERROR_CODES.DATABASE_CONNECTION_ERROR]: 'Erro de conexão com banco de dados',
    [exports.ERROR_CODES.DATABASE_QUERY_ERROR]: 'Erro na consulta ao banco de dados',
    [exports.ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Erro interno no servidor',
    [exports.ERROR_CODES.UNAUTHORIZED]: 'Não autorizado',
    [exports.ERROR_CODES.FORBIDDEN]: 'Acesso negado',
};
//# sourceMappingURL=ErrorCodes.js.map