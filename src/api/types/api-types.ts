import type { System, Monitor } from '@prisma/client';

export interface ApiConfig {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    timeout: number;
    headers?: Record<string, string>;
    expectedStatus: number;
    expectedResponse?: Record<string, any>;
    payload?: Record<string, any>;
    authentication?: {
        type: 'bearer' | 'basic' | 'apikey';
        token?: string;
        username?: string;
        password?: string;
        apiKey?: string;
        headerName?: string;
    };
}

export interface SystemWithApi extends System {
    monitors: Monitor[];
}

export interface ApiCheckResult {
    success: boolean;
    statusCode?: number;
    responseTime: number;
    payload?: any;
    error?: string;
    timestamp: Date;
}

export function isApiConfig(config: any): config is ApiConfig {
    return (
        config &&
        typeof config === 'object' &&
        typeof config.url === 'string' &&
        typeof config.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].includes(config.method) &&
        typeof config.timeout === 'number' &&
        typeof config.expectedStatus === 'number'
    );
}

export function parseApiConfig(jsonConfig: any): ApiConfig {
    if (!isApiConfig(jsonConfig)) {
        throw new Error('Configuração de monitor API inválida');
    }
    return jsonConfig as ApiConfig;
}
