"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/quick-test.ts
const database_1 = require("../config/database");
async function quickTest() {
    try {
        await database_1.prisma.$connect();
        console.log('✅ Relacional OK');
        await database_1.timeseries.$connect();
        console.log('✅ TimescaleDB OK');
        console.log('🎉 Conexões funcionando!');
    }
    catch (error) {
        console.error('❌ Erro:', error);
    }
    process.exit(0);
}
quickTest();
//# sourceMappingURL=quick-test.js.map