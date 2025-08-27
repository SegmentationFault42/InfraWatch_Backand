export class BaseError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number,
        public details?: any
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends BaseError {
    constructor(message: string, details?: any) {
        super(message, 'VALIDATION_ERROR', 400, details);
    }
}

export class NotFoundError extends BaseError {
    constructor(resource: string) {
        super(`${resource} não encontrado`, 'NOT_FOUND', 404);
    }
}

export class ConflictError extends BaseError {
    constructor(message: string) {
        super(message, 'CONFLICT', 409);
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message: string = 'Não autorizado') {
        super(message, 'UNAUTHORIZED', 401);
    }
}