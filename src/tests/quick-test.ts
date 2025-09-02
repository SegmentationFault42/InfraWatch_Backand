// src/quick-test.ts
import { prisma, timeseries } from '../config/database';

async function quickTest() {
    try {
        await prisma.$connect();
        console.log('✅ Relacional OK');

        await timeseries.$connect();
        console.log('✅ TimescaleDB OK');

        console.log('🎉 Conexões funcionando!');
    } catch (error) {
        console.error('❌ Erro:', error);
    }

    process.exit(0);
}

quickTest();
