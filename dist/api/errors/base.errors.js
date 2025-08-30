"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.ConflictError = exports.NotFoundError = exports.ValidationError = exports.BaseError = void 0;
class BaseError extends Error {
    code;
    statusCode;
    details;
    constructor(message, code, statusCode, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = this.constructor.name;
    }
}
exports.BaseError = BaseError;
class ValidationError extends BaseError {
    constructor(message, details) {
        super(message, 'VALIDATION_ERROR', 400, details);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends BaseError {
    constructor(resource) {
        super(`${resource} não encontrado`, 'NOT_FOUND', 404);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends BaseError {
    constructor(message) {
        super(message, 'CONFLICT', 409);
    }
}
exports.ConflictError = ConflictError;
class UnauthorizedError extends BaseError {
    constructor(message = 'Não autorizado') {
        super(message, 'UNAUTHORIZED', 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=base.errors.js.map