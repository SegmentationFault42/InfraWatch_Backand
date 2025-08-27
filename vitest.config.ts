import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        testTimeout: 30000, // Timeout global de 30 segundos (30000ms)
    },
});
