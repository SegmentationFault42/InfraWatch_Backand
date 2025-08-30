export declare class BaseError extends Error {
    code: string;
    statusCode: number;
    details?: any | undefined;
    constructor(message: string, code: string, statusCode: number, details?: any | undefined);
}
export declare class ValidationError extends BaseError {
    constructor(message: string, details?: any);
}
export declare class NotFoundError extends BaseError {
    constructor(resource: string);
}
export declare class ConflictError extends BaseError {
    constructor(message: string);
}
export declare class UnauthorizedError extends BaseError {
    constructor(message?: string);
}
//# sourceMappingURL=base.errors.d.ts.map