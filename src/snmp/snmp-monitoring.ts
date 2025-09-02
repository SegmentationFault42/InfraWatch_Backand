import * as snmp from 'net-snmp';
import { SnmpConfig, SnmpResult } from '../api/types/snmp-types';
import {
    SnmpAuthError,
    SnmpConnectionError,
    SnmpOidError,
    SnmpTimeoutError,
} from '../api/errors/snmp-errors';

export class SnmpMonitor {
    private session: snmp.Session | null = null;

    constructor(private config: SnmpConfig) {}

    async check(): Promise<SnmpResult> {
        const startTime = Date.now();

        try {
            console.log('chegou');
            await this.createSession();
            const values = await this.queryOids();
            const responseTime = Date.now() - startTime;

            return {
                status: 'up',
                timestamp: new Date(),
                responseTime,
                values,
            };
        } catch (error) {
            const responseTime = Date.now() - startTime;
            console.log('erro');
            return {
                status: 'down',
                timestamp: new Date(),
                responseTime,
                values: {},
                error: 'Unknown error',
            };
        } finally {
            this.closeSession();
        }
    }

    private async createSession(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const options: snmp.SessionOptions = {
                port: this.config.port,
                retries: this.config.retries || 3,
                timeout: this.config.timeout,
                version: this.getSnmpVersion(),
            };

            this.session = snmp.createSession(
                this.config.host,
                this.config.community,
                options,
            );

            // Adicionar handler de erro para detectar problemas específicos
            this.session.on('error', (error: Error) => {
                if (error.message.includes('timeout')) {
                    reject(
                        new SnmpTimeoutError(
                            this.config.host,
                            this.config.timeout,
                        ),
                    );
                } else if (
                    error.message.includes('connect') ||
                    error.message.includes('ECONNREFUSED')
                ) {
                    reject(
                        new SnmpConnectionError(
                            this.config.host,
                            this.config.port,
                        ),
                    );
                } else if (
                    error.message.includes('community') ||
                    error.message.includes('authentication')
                ) {
                    reject(new SnmpAuthError(this.config.community));
                } else {
                    reject(error);
                }
            });

            // Session criada com sucesso - resolve imediatamente após criar
            setImmediate(() => resolve());
        });
    }

    private async queryOids(): Promise<Record<string, any>> {
        if (!this.session) throw new Error('SNMP session not initialized');

        return new Promise<Record<string, any>>((resolve, reject) => {
            this.session!.get(
                this.config.oids,
                (error: Error | null, varbinds: snmp.VarBind[]) => {
                    if (error) {
                        // Mapear erros específicos
                        if (error.message.includes('timeout')) {
                            reject(
                                new SnmpTimeoutError(
                                    this.config.host,
                                    this.config.timeout,
                                ),
                            );
                        } else if (error.message.includes('No Such Object')) {
                            reject(
                                new SnmpOidError(this.config.oids.join(', ')),
                            );
                        } else {
                            reject(error);
                        }
                        return;
                    }

                    const values: Record<string, any> = {};

                    // ✅ Iterar sobre os varbinds e usar o OID real retornado
                    varbinds.forEach((vb: snmp.VarBind, index: number) => {
                        // Usar o OID do varbind (mais confiável) ou fallback para o configurado
                        const oid = vb.oid || this.config.oids[index];

                        if (!oid) {
                            console.warn(
                                `SNMP: No OID available for varbind at index ${index}`,
                            );
                            return; // Pular este varbind
                        }

                        if (snmp.isVarbindError(vb)) {
                            console.warn(`SNMP OID Error for ${oid}:`, vb);
                            values[oid] = null;
                        } else {
                            values[oid] = this.parseSnmpValue(vb);
                        }
                    });

                    resolve(values);
                },
            );
        });
    }

    private parseSnmpValue(varbind: snmp.VarBind): any {
        const value = varbind.value;

        switch (varbind.type) {
            case snmp.ObjectType.Integer:
            case snmp.ObjectType.Counter:
            case snmp.ObjectType.Gauge:
            case snmp.ObjectType.TimeTicks:
                return typeof value === 'string'
                    ? parseInt(value, 10)
                    : Number(value);

            case snmp.ObjectType.Counter64:
                // Para valores grandes (interface counters)
                try {
                    return typeof value === 'string'
                        ? BigInt(value)
                        : BigInt(Number(value));
                } catch {
                    return BigInt(0);
                }

            case snmp.ObjectType.OctetString:
                return Buffer.isBuffer(value)
                    ? value.toString('utf8')
                    : String(value);

            case snmp.ObjectType.IpAddress:
                return Buffer.isBuffer(value)
                    ? value.toString()
                    : String(value);

            case snmp.ObjectType.Opaque:
                // Para valores especiais como temperatura
                return value;

            default:
                return value;
        }
    }

    private getSnmpVersion(): snmp.Version {
        switch (this.config.version) {
            case '1':
                return snmp.Version1;
            case '2c':
                return snmp.Version2c;
            case '3':
                return snmp.Version3;
            default:
                return snmp.Version2c;
        }
    }

    private closeSession(): void {
        if (this.session) {
            this.session.close();
            this.session = null;
        }
    }

    // Método adicional para testar conexão sem fazer queries
    async testConnection(): Promise<boolean> {
        try {
            await this.createSession();
            return true;
        } catch (error) {
            return false;
        } finally {
            this.closeSession();
        }
    }

    // Método para obter informações do sistema SNMP
    async getSystemInfo(): Promise<Record<string, any>> {
        const systemOids = [
            '1.3.6.1.2.1.1.1.0', // sysDescr
            '1.3.6.1.2.1.1.2.0', // sysObjectID
            '1.3.6.1.2.1.1.3.0', // sysUpTime
            '1.3.6.1.2.1.1.4.0', // sysContact
            '1.3.6.1.2.1.1.5.0', // sysName
            '1.3.6.1.2.1.1.6.0', // sysLocation
        ];

        // Criar uma nova instância com OIDs do sistema para não modificar a original
        const systemConfig: SnmpConfig = {
            ...this.config,
            oids: systemOids,
        };

        const systemMonitor = new SnmpMonitor(systemConfig);

        try {
            const result = await systemMonitor.check();
            return result.values;
        } finally {
            systemMonitor.closeSession();
        }
    }

    // Método para query de OIDs específicos
    async querySpecificOids(oids: string[]): Promise<Record<string, any>> {
        const specificConfig: SnmpConfig = {
            ...this.config,
            oids,
        };

        const specificMonitor = new SnmpMonitor(specificConfig);

        try {
            const result = await specificMonitor.check();
            return result.values;
        } finally {
            specificMonitor.closeSession();
        }
    }

    // Método para walk SNMP (útil para descobrir OIDs)
    async walkOid(baseOid: string): Promise<Record<string, any>> {
        if (!this.session) {
            await this.createSession();
        }

        return new Promise<Record<string, any>>((resolve, reject) => {
            const results: Record<string, any> = {};

            this.session!.walk(
                baseOid,
                (error: Error | null, varbinds: snmp.VarBind[]) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    varbinds.forEach((vb: snmp.VarBind) => {
                        if (!snmp.isVarbindError(vb)) {
                            results[vb.oid] = this.parseSnmpValue(vb);
                        }
                    });
                },
                (error: Error | null) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                },
            );
        });
    }
}
