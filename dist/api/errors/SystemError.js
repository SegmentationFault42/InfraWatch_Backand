"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemError = void 0;
class SystemError extends Error {
    code;
    statusCode;
    details;
    constructor(code, message, statusCode = 500, details) {
        super(message);
        this.name = 'SystemError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SystemError);
        }
    }
}
exports.SystemError = SystemError;
//# sourceMappingURL=SystemError.js.map