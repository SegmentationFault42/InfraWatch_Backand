export class SystemError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly details?: any;

    constructor(
        code: string,
        message: string,
        statusCode: number = 500,
        details?: any,
    ) {
        super(message);
        this.name = 'SystemError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;

        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SystemError);
        }
    }
}
