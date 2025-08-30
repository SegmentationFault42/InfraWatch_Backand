import { SystemError } from './SystemError';
export declare class ErrorFactory {
    static validationError(details?: any): SystemError;
    static systemAlreadyExists(): SystemError;
    static systemNotFound(): SystemError;
    static systemCreateFailed(details?: any): SystemError;
    static systemDeleteFailed(): SystemError;
    static systemUpdateFailed(details?: any): SystemError;
    static internalServerError(details?: any): SystemError;
}
//# sourceMappingURL=ErrorFactory.d.ts.map