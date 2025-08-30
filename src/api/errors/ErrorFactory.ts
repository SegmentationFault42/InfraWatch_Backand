import { SystemError } from './SystemError';
import { ERROR_CODES, ERROR_MESSAGES } from './ErrorCodes';

export class ErrorFactory {
    static validationError(details?: any): SystemError {
        return new SystemError(
            ERROR_CODES.VALIDATION_FAILED,
            ERROR_MESSAGES[ERROR_CODES.VALIDATION_FAILED],
            400,
            details,
        );
    }

    static systemAlreadyExists(): SystemError {
        return new SystemError(
            ERROR_CODES.SYSTEM_ALREADY_EXISTS,
            ERROR_MESSAGES[ERROR_CODES.SYSTEM_ALREADY_EXISTS],
            400,
        );
    }

    static systemNotFound(): SystemError {
        return new SystemError(
            ERROR_CODES.SYSTEM_NOT_FOUND,
            ERROR_MESSAGES[ERROR_CODES.SYSTEM_NOT_FOUND],
            404,
        );
    }

    static systemCreateFailed(details?: any): SystemError {
        return new SystemError(
            ERROR_CODES.SYSTEM_CREATE_FAILED,
            ERROR_MESSAGES[ERROR_CODES.SYSTEM_CREATE_FAILED],
            500,
            details,
        );
    }

    static systemDeleteFailed(): SystemError {
        return new SystemError(
            ERROR_CODES.SYSTEM_DELETE_FAILED,
            ERROR_MESSAGES[ERROR_CODES.SYSTEM_DELETE_FAILED],
            400,
        );
    }

    static systemUpdateFailed(details?: any): SystemError {
        return new SystemError(
            ERROR_CODES.SYSTEM_UPDATE_FAILED,
            ERROR_MESSAGES[ERROR_CODES.SYSTEM_UPDATE_FAILED],
            500,
            details,
        );
    }

    static internalServerError(details?: any): SystemError {
        return new SystemError(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR],
            500,
            details,
        );
    }
}
