// src/services/webhook-service.ts
/*import { webhookRepository } from '../repositories/webhook-repository';
import type {
    SystemWithWebhook,
    IncomingWebhookData,
    WebhookMetrics,
} from '../types/webhook-types';
import { systemRepository } from '../repositories/SystemRepositories';
import { alertRepository } from '../repositories/alert.repository';

export class WebhookService {
    async getAllWebhookSystems(): Promise<SystemWithWebhook[]> {
        return await webhookRepository.findAllWebhookSystems();
    }

    async getWebhookSystemById(id: string): Promise<SystemWithWebhook> {
        const system = await webhookRepository.findWebhookSystemById(id);

        if (!system) {
            throw new Error(`Sistema WEBHOOK com ID ${id} não encontrado`);
        }

        return system;
    }

    async processIncomingWebhook(
        systemId: string,
        webhookData: any,
    ): Promise<void> {
        const system = await this.getWebhookSystemById(systemId);

        const processedData: IncomingWebhookData = {
            systemId,
            timestamp: webhookData.timestamp
                ? new Date(webhookData.timestamp)
                : new Date(),
            status: webhookData.status
                ? this.validateStatus(webhookData.status)
                : undefined,
            message: webhookData.message || webhookData.error || undefined,
            data: webhookData,
            source: webhookData.source || 'webhook',
            receivedAt: new Date(),
        };

        // Validar campos obrigatórios se configurado
        if (system.monitors[0]?.config?.expectedFields) {
            this.validateRequiredFields(
                webhookData,
                system.monitors[0].config.expectedFields,
            );
        }

        // Salvar dados do webhook recebido
        await webhookRepository.saveIncomingWebhookData(processedData);

        // Salvar métricas
        const metrics = this.convertToMetrics(
            systemId,
            processedData,
            webhookData,
        );
        await webhookRepository.saveMetrics(metrics);

        // Atualizar status do sistema apenas se foi fornecido um status
        if (processedData.status && processedData.status !== system.status) {
            await systemRepository.updateSystemStatus(
                systemId,
                processedData.status,
            );

            // Gerar alerta apenas se o próprio sistema reportou problema
            if (processedData.status === 'down') {
                await alertRepository.createAlertForWEBHOOK(
                    systemId,
                    'Sistema reportou estado Down',
                    processedData.message ||
                        `O sistema ${system.name} reportou estado Down via webhook`,
                );
            } else if (processedData.status === 'warning') {
                await alertRepository.createAlertForWEBHOOK(
                    systemId,
                    'Sistema reportou warning',
                    processedData.message ||
                        `O sistema ${system.name} reportou um warning via webhook`,
                );
            }
        }

        // Atualizar timestamp do último webhook recebido
        await this.updateLastWebhookReceived(systemId);
    }

    async getIncomingWebhookHistory(
        systemId: string,
        from: Date,
        to: Date,
    ): Promise<IncomingWebhookData[]> {
        await this.getWebhookSystemById(systemId);
        return await webhookRepository.getIncomingWebhookHistory(
            systemId,
            from,
            to,
        );
    }

    async getSystemMetrics(
        systemId: string,
        from: Date,
        to: Date,
    ): Promise<WebhookMetrics[]> {
        await this.getWebhookSystemById(systemId);
        return await webhookRepository.getMetricsHistory(systemId, from, to);
    }

    async getSystemStatus(systemId: string): Promise<{
        system: SystemWithWebhook;
        recentWebhooks: IncomingWebhookData[];
        recentMetrics: WebhookMetrics[];
        totalWebhooksReceived: number;
    }> {
        const system = await this.getWebhookSystemById(systemId);
        const recentWebhooks = await this.getIncomingWebhookHistory(
            systemId,
            new Date(Date.now() - 24 * 60 * 60 * 1000),
            new Date(),
        );
        const recentMetrics = await this.getSystemMetrics(
            systemId,
            new Date(Date.now() - 24 * 60 * 60 * 1000),
            new Date(),
        );

        const totalWebhooksReceived =
            await webhookRepository.countWebhooksReceived(systemId);

        return {
            system,
            recentWebhooks,
            recentMetrics,
            totalWebhooksReceived,
        };
    }

    private async updateLastWebhookReceived(systemId: string): Promise<void> {
        await systemRepository.updateLastWebhookReceived(systemId, new Date());
    }

    private validateStatus(status: any): 'up' | 'down' | 'warning' | 'unknown' {
        const validStatuses = ['up', 'down', 'warning', 'unknown'];
        return validStatuses.includes(status) ? status : 'unknown';
    }

    private validateRequiredFields(data: any, requiredFields: string[]): void {
        for (const field of requiredFields) {
            if (
                !(field in data) ||
                data[field] === undefined ||
                data[field] === null
            ) {
                throw new Error(
                    `Campo obrigatório '${field}' não encontrado no webhook`,
                );
            }
        }
    }

    private convertToMetrics(
        systemId: string,
        data: IncomingWebhookData,
        rawData: any,
    ): WebhookMetrics {
        return {
            time: data.receivedAt,
            systemId,
            status: data.status
                ? this.mapStatusToNumber(data.status)
                : undefined,
            message: data.message,
            source: data.source,
            eventType: this.determineEventType(rawData),
        };
    }

    private determineEventType(data: any): string {
        if (data.status) return 'status_change';
        if (data.alert || data.error) return 'alert';
        if (data.info || data.message) return 'info';
        return 'data';
    }

    private mapStatusToNumber(status: string): number {
        switch (status) {
            case 'up':
                return 1;
            case 'down':
                return 0;
            case 'warning':
                return 2;
            case 'unknown':
                return -1;
            default:
                return -1;
        }
    }
}

export const webhookService = new WebhookService();
*/