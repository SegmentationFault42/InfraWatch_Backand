declare module 'net-snmp' {
    export enum Version {
        Version1 = 0,
        Version2c = 1,
        Version3 = 3,
    }

    export enum ObjectType {
        Boolean = 1,
        Integer = 2,
        BitString = 3,
        OctetString = 4,
        Null = 5,
        OID = 6,
        ObjectDescriptor = 7,
        External = 8,
        Real = 9,
        Enumerated = 10,
        PDV = 11,
        UTF8String = 12,
        RelativeOID = 13,
        Sequence = 16,
        Set = 17,
        NumericString = 18,
        PrintableString = 19,
        T61String = 20,
        VideotexString = 21,
        IA5String = 22,
        UTCTime = 23,
        GeneralizedTime = 24,
        GraphicString = 25,
        VisibleString = 26,
        GeneralString = 27,
        UniversalString = 28,
        CharacterString = 29,
        BMPString = 30,
        Counter = 65,
        Gauge = 66,
        TimeTicks = 67,
        Opaque = 68,
        NsapAddress = 69,
        Counter64 = 70,
        Unsigned32 = 71,
        IpAddress = 64,
    }

    export interface VarBind {
        oid: string;
        type: ObjectType;
        value: any;
        error?: Error;
    }

    export interface SessionOptions {
        port?: number;
        retries?: number;
        timeout?: number;
        version?: Version;
        transport?: string;
        trapPort?: number;
        bindLocal?: boolean;
        idBitsSize?: number;
    }

    export interface Session {
        get(
            oids: string[],
            callback: (error: Error | null, varbinds: VarBind[]) => void,
        ): void;
        getBulk(
            oids: string[],
            nonRepeaters: number,
            maxRepetitions: number,
            callback: (error: Error | null, varbinds: VarBind[]) => void,
        ): void;
        getNext(
            oids: string[],
            callback: (error: Error | null, varbinds: VarBind[]) => void,
        ): void;
        set(
            varbinds: VarBind[],
            callback: (error: Error | null, varbinds: VarBind[]) => void,
        ): void;
        walk(
            oid: string,
            callback: (error: Error | null, varbinds: VarBind[]) => void,
            done?: (error: Error | null) => void,
        ): void;
        table(
            oid: string,
            maxRepetitions: number,
            callback: (error: Error | null, table: any) => void,
        ): void;
        tableColumns(
            oid: string,
            columns: string[],
            maxRepetitions: number,
            callback: (error: Error | null, table: any) => void,
        ): void;
        subtree(
            oid: string,
            maxRepetitions: number,
            callback: (error: Error | null, varbinds: VarBind[]) => void,
        ): void;
        close(): void;
        on(event: 'error', listener: (error: Error) => void): this;
        on(event: 'close', listener: () => void): this;
        on(event: string, listener: (...args: any[]) => void): this;
    }

    export function createSession(
        target: string,
        community: string,
        options?: SessionOptions,
    ): Session;
    export function isVarbindError(varbind: VarBind): boolean;
    export function varbindError(
        oid: string,
        type: ObjectType,
        error: Error,
    ): VarBind;

    // Constantes comuns
    export const Version1: Version;
    export const Version2c: Version;
    export const Version3: Version;
}
