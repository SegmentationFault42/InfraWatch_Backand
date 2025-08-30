"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnmpOidError = exports.SnmpAuthError = exports.SnmpConnectionError = exports.SnmpTimeoutError = exports.SnmpError = void 0;
class SnmpError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.name = 'SnmpError';
        this.code = code;
        // Manter stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SnmpError);
        }
    }
}
exports.SnmpError = SnmpError;
class SnmpTimeoutError extends SnmpError {
    constructor(host, timeout) {
        super(`SNMP timeout for host ${host} after ${timeout}ms`, 'SNMP_TIMEOUT');
        this.name = 'SnmpTimeoutError';
    }
}
exports.SnmpTimeoutError = SnmpTimeoutError;
class SnmpConnectionError extends SnmpError {
    constructor(host, port) {
        super(`Cannot connect to SNMP agent at ${host}:${port}`, 'SNMP_CONNECTION_ERROR');
        this.name = 'SnmpConnectionError';
    }
}
exports.SnmpConnectionError = SnmpConnectionError;
class SnmpAuthError extends SnmpError {
    constructor(community) {
        super(`SNMP authentication failed with community: ${community}`, 'SNMP_AUTH_ERROR');
        this.name = 'SnmpAuthError';
    }
}
exports.SnmpAuthError = SnmpAuthError;
class SnmpOidError extends SnmpError {
    constructor(oid) {
        super(`Invalid or unreachable OID: ${oid}`, 'SNMP_OID_ERROR');
        this.name = 'SnmpOidError';
    }
}
exports.SnmpOidError = SnmpOidError;
//# sourceMappingURL=snmp-errors.js.map