"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnmpMonitor = void 0;
const snmp = __importStar(require("net-snmp"));
const snmp_errors_1 = require("../api/errors/snmp-errors");
class SnmpMonitor {
    config;
    session = null;
    constructor(config) {
        this.config = config;
    }
    // ... resto do código permanece igual ...
    async check() {
        const startTime = Date.now();
        try {
            await this.createSession();
            const values = await this.queryOids();
            const responseTime = Date.now() - startTime;
            return {
                status: 'up',
                timestamp: new Date(),
                responseTime,
                values,
            };
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            return {
                status: 'down',
                timestamp: new Date(),
                responseTime,
                values: {},
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
        finally {
            this.closeSession();
        }
    }
    async createSession() {
        return new Promise((resolve, reject) => {
            const options = {
                port: this.config.port,
                retries: this.config.retries || 3,
                timeout: this.config.timeout,
                version: this.getSnmpVersion(),
            };
            this.session = snmp.createSession(this.config.host, this.config.community, options);
            // Adicionar handler de erro para detectar problemas específicos
            this.session.on('error', (error) => {
                if (error.message.includes('timeout')) {
                    reject(new snmp_errors_1.SnmpTimeoutError(this.config.host, this.config.timeout));
                }
                else if (error.message.includes('connect') ||
                    error.message.includes('ECONNREFUSED')) {
                    reject(new snmp_errors_1.SnmpConnectionError(this.config.host, this.config.port));
                }
                else if (error.message.includes('community') ||
                    error.message.includes('authentication')) {
                    reject(new snmp_errors_1.SnmpAuthError(this.config.community));
                }
                else {
                    reject(error);
                }
            });
            // Session criada com sucesso - resolve imediatamente após criar
            setImmediate(() => resolve());
        });
    }
    async queryOids() {
        if (!this.session)
            throw new Error('SNMP session not initialized');
        return new Promise((resolve, reject) => {
            this.session.get(this.config.oids, (error, varbinds) => {
                if (error) {
                    // Mapear erros específicos
                    if (error.message.includes('timeout')) {
                        reject(new snmp_errors_1.SnmpTimeoutError(this.config.host, this.config.timeout));
                    }
                    else if (error.message.includes('No Such Object')) {
                        reject(new snmp_errors_1.SnmpOidError(this.config.oids.join(', ')));
                    }
                    else {
                        reject(error);
                    }
                    return;
                }
                const values = {};
                // ✅ Iterar sobre os varbinds e usar o OID real retornado
                varbinds.forEach((vb, index) => {
                    // Usar o OID do varbind (mais confiável) ou fallback para o configurado
                    const oid = vb.oid || this.config.oids[index];
                    if (!oid) {
                        console.warn(`SNMP: No OID available for varbind at index ${index}`);
                        return; // Pular este varbind
                    }
                    if (snmp.isVarbindError(vb)) {
                        console.warn(`SNMP OID Error for ${oid}:`, vb);
                        values[oid] = null;
                    }
                    else {
                        values[oid] = this.parseSnmpValue(vb);
                    }
                });
                resolve(values);
            });
        });
    }
    parseSnmpValue(varbind) {
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
                }
                catch {
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
    getSnmpVersion() {
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
    closeSession() {
        if (this.session) {
            this.session.close();
            this.session = null;
        }
    }
    // Método adicional para testar conexão sem fazer queries
    async testConnection() {
        try {
            await this.createSession();
            return true;
        }
        catch (error) {
            return false;
        }
        finally {
            this.closeSession();
        }
    }
    // Método para obter informações do sistema SNMP
    async getSystemInfo() {
        const systemOids = [
            '1.3.6.1.2.1.1.1.0', // sysDescr
            '1.3.6.1.2.1.1.2.0', // sysObjectID
            '1.3.6.1.2.1.1.3.0', // sysUpTime
            '1.3.6.1.2.1.1.4.0', // sysContact
            '1.3.6.1.2.1.1.5.0', // sysName
            '1.3.6.1.2.1.1.6.0', // sysLocation
        ];
        // Criar uma nova instância com OIDs do sistema para não modificar a original
        const systemConfig = {
            ...this.config,
            oids: systemOids,
        };
        const systemMonitor = new SnmpMonitor(systemConfig);
        try {
            const result = await systemMonitor.check();
            return result.values;
        }
        finally {
            systemMonitor.closeSession();
        }
    }
    // Método para query de OIDs específicos
    async querySpecificOids(oids) {
        const specificConfig = {
            ...this.config,
            oids,
        };
        const specificMonitor = new SnmpMonitor(specificConfig);
        try {
            const result = await specificMonitor.check();
            return result.values;
        }
        finally {
            specificMonitor.closeSession();
        }
    }
    // Método para walk SNMP (útil para descobrir OIDs)
    async walkOid(baseOid) {
        if (!this.session) {
            await this.createSession();
        }
        return new Promise((resolve, reject) => {
            const results = {};
            this.session.walk(baseOid, (error, varbinds) => {
                if (error) {
                    reject(error);
                    return;
                }
                varbinds.forEach((vb) => {
                    if (!snmp.isVarbindError(vb)) {
                        results[vb.oid] = this.parseSnmpValue(vb);
                    }
                });
            }, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
}
exports.SnmpMonitor = SnmpMonitor;
//# sourceMappingURL=snmp-monitoring.js.map