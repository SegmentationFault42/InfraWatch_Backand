import { apiService } from '../api/services/api-service';
import { parseApiConfig } from '../api/types/api-types';
import { apiRepository } from '../api/repositories/api-repository';

export class ApiMonitoring {
    async executeApiCheck(systemId: string) {
        console.log(
            `[ApiMonitoring] Iniciando verificação API para sistema ${systemId}`,
        );
        await apiService.processApiCheck(systemId);
    }

    async executeManualCheck(systemId: string): Promise<any> {
        const system = await apiRepository.findSystemById(systemId);
        await console.log(
            `[ApiMonitoring] Iniciando verificação API para sistema ${systemId}`,
        );
        if (!system || !system.monitors || system.monitors.length === 0) {
            throw new Error('Sistema não encontrado ou sem monitores API');
        }

        const monitor = system.monitors[0];
        if (!monitor) return;
        let config;
        try {
            config = parseApiConfig(monitor.config);
        } catch (error: any) {
            throw new Error(`Configuração inválida: ${error.message}`);
        }

        return await apiService.checkApiEndpoint(config);
    }
}

export const apiMonitoring = new ApiMonitoring();
