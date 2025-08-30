"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFactory = void 0;
const SystemError_1 = require("./SystemError");
const ErrorCodes_1 = require("./ErrorCodes");
class ErrorFactory {
    static validationError(details) {
        return new SystemError_1.SystemError(ErrorCodes_1.ERROR_CODES.VALIDATION_FAILED, ErrorCodes_1.ERROR_MESSAGES[ErrorCodes_1.ERROR_CODES.VALIDATION_FAILED], 400, details);
    }
    static systemAlreadyExists() {
        return new SystemError_1.SystemError(ErrorCodes_1.ERROR_CODES.SYSTEM_ALREADY_EXISTS, ErrorCodes_1.ERROR_MESSAGES[ErrorCodes_1.ERROR_CODES.SYSTEM_ALREADY_EXISTS], 400);
    }
    static systemNotFound() {
        return new SystemError_1.SystemError(ErrorCodes_1.ERROR_CODES.SYSTEM_NOT_FOUND, ErrorCodes_1.ERROR_MESSAGES[ErrorCodes_1.ERROR_CODES.SYSTEM_NOT_FOUND], 404);
    }
    static systemCreateFailed(details) {
        return new SystemError_1.SystemError(ErrorCodes_1.ERROR_CODES.SYSTEM_CREATE_FAILED, ErrorCodes_1.ERROR_MESSAGES[ErrorCodes_1.ERROR_CODES.SYSTEM_CREATE_FAILED], 500, details);
    }
    static systemDeleteFailed() {
        return new SystemError_1.SystemError(ErrorCodes_1.ERROR_CODES.SYSTEM_DELETE_FAILED, ErrorCodes_1.ERROR_MESSAGES[ErrorCodes_1.ERROR_CODES.SYSTEM_DELETE_FAILED], 400);
    }
    static systemUpdateFailed(details) {
        return new SystemError_1.SystemError(ErrorCodes_1.ERROR_CODES.SYSTEM_UPDATE_FAILED, ErrorCodes_1.ERROR_MESSAGES[ErrorCodes_1.ERROR_CODES.SYSTEM_UPDATE_FAILED], 500, details);
    }
    static internalServerError(details) {
        return new SystemError_1.SystemError(ErrorCodes_1.ERROR_CODES.INTERNAL_SERVER_ERROR, ErrorCodes_1.ERROR_MESSAGES[ErrorCodes_1.ERROR_CODES.INTERNAL_SERVER_ERROR], 500, details);
    }
}
exports.ErrorFactory = ErrorFactory;
//# sourceMappingURL=ErrorFactory.js.map