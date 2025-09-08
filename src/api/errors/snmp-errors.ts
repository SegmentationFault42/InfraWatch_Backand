export class SnmpError extends Error {
    public readonly code?: string;

    constructor(message: string, code?: string) {
        super(message);
        this.name = 'SnmpError';
        this.code = code;

        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SnmpError);
        }
    }
}

export class SnmpTimeoutError extends SnmpError {
    constructor(host: string, timeout: number) {
        super(
            `SNMP timeout for host ${host} after ${timeout}ms`,
            'SNMP_TIMEOUT',
        );
        this.name = 'SnmpTimeoutError';
    }
}

export class SnmpConnectionError extends SnmpError {
    constructor(host: string, port: number) {
        super(
            `Cannot connect to SNMP agent at ${host}:${port}`,
            'SNMP_CONNECTION_ERROR',
        );
        this.name = 'SnmpConnectionError';
    }
}

export class SnmpAuthError extends SnmpError {
    constructor(community: string) {
        super(
            `SNMP authentication failed with community: ${community}`,
            'SNMP_AUTH_ERROR',
        );
        this.name = 'SnmpAuthError';
    }
}

export class SnmpOidError extends SnmpError {
    constructor(oid: string) {
        super(`Invalid or unreachable OID: ${oid}`, 'SNMP_OID_ERROR');
        this.name = 'SnmpOidError';
    }
}
