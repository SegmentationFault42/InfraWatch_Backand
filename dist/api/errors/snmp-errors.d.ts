export declare class SnmpError extends Error {
    readonly code?: string;
    constructor(message: string, code?: string);
}
export declare class SnmpTimeoutError extends SnmpError {
    constructor(host: string, timeout: number);
}
export declare class SnmpConnectionError extends SnmpError {
    constructor(host: string, port: number);
}
export declare class SnmpAuthError extends SnmpError {
    constructor(community: string);
}
export declare class SnmpOidError extends SnmpError {
    constructor(oid: string);
}
//# sourceMappingURL=snmp-errors.d.ts.map