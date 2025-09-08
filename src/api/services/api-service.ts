import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiConfig, ApiCheckResult } from '../types/api-types';
import { parseApiConfig } from '../types/api-types';
import { apiRepository } from '../repositories/api-repository';

class ApiService {
    async checkApiEndpoint(config: ApiConfig): Promise<ApiCheckResult> {
        const startTime = Date.now();

        try {
            const axiosConfig: AxiosRequestConfig = {
                method: config.method,
                url: config.url,
                timeout: config.timeout,
                headers: config.headers || {},
                validateStatus: () => true,
            };

            if (config.authentication) {
                this.addAuthentication(axiosConfig, config.authentication);
            }

            if (config.payload && ['POST', 'PUT'].includes(config.method)) {
                axiosConfig.data = config.payload;
            }

            const response: AxiosResponse = await axios(axiosConfig);
            const responseTime = Date.now() - startTime;

            const statusOk = response.status === config.expectedStatus;

            let responseOk = true;
            if (config.expectedResponse) {
                responseOk = this.validateResponse(
                    response.data,
                    config.expectedResponse,
                );
            }

            return {
                success: statusOk && responseOk,
                statusCode: response.status,
                responseTime,
                payload: response.data,
                timestamp: new Date(),
            };
        } catch (error: any) {
            const responseTime = Date.now() - startTime;

            return {
                success: false,
                responseTime,
                error: error.message || 'Erro desconhecido na requisição API',
                timestamp: new Date(),
                statusCode: 404,
            };
        }
    }

    async processApiCheck(systemId: string) {
        try {
            const system = await apiRepository.findSystemById(systemId);

            if (!system || !system.monitors || system.monitors.length === 0) {
                throw new Error(
                    `Sistema ${systemId} não encontrado ou sem monitores API`,
                );
            }

            const monitor = system.monitors[0];
            if (!monitor) return;

            let config: ApiConfig;

            try {
                config = parseApiConfig(monitor.config);
            } catch (error: any) {
                throw new Error(
                    `Configuração inválida para monitor ${monitor.id}: ${error.message}`,
                );
            }

            const result = await this.checkApiEndpoint(config);

            await apiRepository.saveMetrics({
                deviceId: systemId,
                endpoint: config.url,
                statusCode: result.statusCode,
                responseTimeMs: result.responseTime,
                payloadSize: result.payload
                    ? JSON.stringify(result.payload).length
                    : undefined,
            });

            const newStatus = result.success ? 'up' : 'down';
            await apiRepository.updateSystemStatus(systemId, newStatus);

            console.log(
                `[ApiService] Sistema ${system.name}: ${newStatus} (${result.responseTime}ms)`,
            );
            return result;
        } catch (error: any) {
            console.error(
                `[ApiService] Erro ao verificar sistema ${systemId}:`,
                error.message,
            );
            await apiRepository.updateSystemStatus(systemId, 'unknown');
        }
    }

    private addAuthentication(
        config: AxiosRequestConfig,
        auth: ApiConfig['authentication'],
    ) {
        if (!auth || !config.headers) return;

        switch (auth.type) {
            case 'bearer':
                if (auth.token) {
                    config.headers['Authorization'] = `Bearer ${auth.token}`;
                }
                break;
            case 'basic':
                if (auth.username && auth.password) {
                    const credentials = Buffer.from(
                        `${auth.username}:${auth.password}`,
                    ).toString('base64');
                    config.headers['Authorization'] = `Basic ${credentials}`;
                }
                break;
            case 'apikey':
                if (auth.apiKey && auth.headerName) {
                    config.headers[auth.headerName] = auth.apiKey;
                }
                break;
        }
    }

    private validateResponse(
        actual: any,
        expected: Record<string, any>,
    ): boolean {
        try {
            for (const [key, value] of Object.entries(expected)) {
                if (actual[key] !== value) {
                    return false;
                }
            }
            return true;
        } catch {
            return false;
        }
    }
}

export const apiService = new ApiService();
