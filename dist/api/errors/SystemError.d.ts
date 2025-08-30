export declare class SystemError extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly details?: any;
    constructor(code: string, message: string, statusCode?: number, details?: any);
}
//# sourceMappingURL=SystemError.d.ts.map