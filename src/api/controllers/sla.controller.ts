// src/controllers/sla.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { SLAService } from '../services/sla.service';
import {
    CreateSLAConfigRequest,
    UpdateSLAConfigRequest,
    SLAHistoryQuery,
    MonthlySLAReportQuery,
    SLAListResponse,
    SLADetailsResponse,
    SLAHistoryResponse,
    MonthlySLAReportResponse,
    SLAConfigResponse,
    SLAErrorCode,
    SLAError,
} from '../types/sla.types';

// Interfaces para os parâmetros das rotas
interface SLAParams {
    systemId: string;
}

interface SLAHistoryQuerystring {
    limit?: string;
    startDate?: string;
    endDate?: string;
}

interface MonthlyReportQuerystring {
    month?: string;
    year?: string;
    systemIds?: string;
}

export class SLAController {
    private slaService: SLAService;

    constructor() {
        this.slaService = new SLAService();
    }

    async getAllSLAs(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<void> {
        try {
            const slas = await this.slaService.getAllSLAs();

            const response: SLAListResponse = {
                success: true,
                data: slas,
                meta: {
                    total: slas.length,
                    compliant: slas.filter((s) => s.status === 'compliant')
                        .length,
                    atRisk: slas.filter((s) => s.status === 'at_risk').length,
                    breached: slas.filter((s) => s.status === 'breach').length,
                },
            };

            reply.status(200).send(response);
        } catch (error) {
            this.handleError(reply, error as SLAError);
        }
    }

    async getSLABySystemId(
        request: FastifyRequest<{ Params: SLAParams }>,
        reply: FastifyReply,
    ): Promise<void> {
        try {
            const { systemId } = request.params;
            const sla = await this.slaService.getSLABySystemId(systemId);

            if (!sla) {
                const response: SLADetailsResponse = {
                    success: false,
                    data: null,
                };
                reply.status(404).send({
                    ...response,
                    message: 'SLA não configurado para este sistema',
                });
                return;
            }

            const response: SLADetailsResponse = {
                success: true,
                data: sla,
            };

            reply.status(200).send(response);
        } catch (error) {
            this.handleError(reply, error as SLAError);
        }
    }

    async configureSLA(
        request: FastifyRequest<{
            Params: SLAParams;
            Body: CreateSLAConfigRequest;
        }>,
        reply: FastifyReply,
    ): Promise<void> {
        try {
            const { systemId } = request.params;
            const slaData = request.body;

            const sla = await this.slaService.configureSLA(systemId, slaData);

            const response: SLAConfigResponse = {
                success: true,
                data: sla,
                message: 'SLA configurado com sucesso',
            };

            reply.status(200).send(response);
        } catch (error) {
            this.handleError(reply, error as SLAError);
        }
    }

    async updateSLA(
        request: FastifyRequest<{
            Params: SLAParams;
            Body: UpdateSLAConfigRequest;
        }>,
        reply: FastifyReply,
    ): Promise<void> {
        try {
            const { systemId } = request.params;
            const updateData = request.body;

            // Converter UpdateSLAConfigRequest para CreateSLAConfigRequest
            // mantendo os valores existentes se não fornecidos
            const existingSLA =
                await this.slaService.getSLABySystemId(systemId);
            if (!existingSLA) {
                reply.status(404).send({
                    success: false,
                    message: 'SLA não encontrado para este sistema',
                });
                return;
            }

            const slaData: CreateSLAConfigRequest = {
                uptimeTarget:
                    updateData.uptimeTarget ?? existingSLA.uptimeTarget,
                maxDowntime: updateData.maxDowntime ?? existingSLA.maxDowntime,
                responseTimeTarget:
                    updateData.responseTimeTarget ??
                    existingSLA.responseTimeTarget,
                monitoringWindow:
                    updateData.monitoringWindow ?? existingSLA.monitoringWindow,
            };

            const sla = await this.slaService.configureSLA(systemId, slaData);

            const response: SLAConfigResponse = {
                success: true,
                data: sla,
                message: 'SLA atualizado com sucesso',
            };

            reply.status(200).send(response);
        } catch (error) {
            this.handleError(reply, error as SLAError);
        }
    }

    async getSLAHistory(
        request: FastifyRequest<{
            Params: SLAParams;
            Querystring: SLAHistoryQuerystring;
        }>,
        reply: FastifyReply,
    ): Promise<void> {
        try {
            const { systemId } = request.params;
            const { limit, startDate, endDate } = request.query;

            const query: SLAHistoryQuery = {
                systemId,
                limit: limit ? parseInt(limit, 10) : undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            };

            // Validar datas se fornecidas
            if (query.startDate && isNaN(query.startDate.getTime())) {
                reply.status(400).send({
                    success: false,
                    message: 'Data de início inválida',
                });
                return;
            }

            if (query.endDate && isNaN(query.endDate.getTime())) {
                reply.status(400).send({
                    success: false,
                    message: 'Data de fim inválida',
                });
                return;
            }

            const history = await this.slaService.getSLAHistory(query);

            const response: SLAHistoryResponse = {
                success: true,
                data: history,
                meta: {
                    total: history.length,
                    hasMore: history.length === (query.limit || 12),
                },
            };

            reply.status(200).send(response);
        } catch (error) {
            this.handleError(reply, error as SLAError);
        }
    }

    async getMonthlySLAReport(
        request: FastifyRequest<{ Querystring: MonthlyReportQuerystring }>,
        reply: FastifyReply,
    ): Promise<void> {
        try {
            const { month, year, systemIds } = request.query;

            let parsedMonth: Date | undefined;
            if (month) {
                parsedMonth = new Date(month);
                if (isNaN(parsedMonth.getTime())) {
                    reply.status(400).send({
                        success: false,
                        message: 'Formato de mês inválido. Use YYYY-MM-DD',
                    });
                    return;
                }
            }

            const query: MonthlySLAReportQuery = {
                month: parsedMonth,
                year: year ? parseInt(year, 10) : undefined,
                systemIds: systemIds
                    ? systemIds.split(',').filter((id) => id.trim())
                    : undefined,
            };

            const report = await this.slaService.getMonthlySLAReport(query);

            const response: MonthlySLAReportResponse = {
                success: true,
                data: report,
            };

            reply.status(200).send(response);
        } catch (error) {
            this.handleError(reply, error as SLAError);
        }
    }

    private handleError(reply: FastifyReply, error: SLAError): void {
        console.error('SLA Controller Error:', {
            message: error.message,
            code: error.code,
            stack: error.stack,
            details: error.details,
        });

        if (error.code) {
            switch (error.code) {
                case SLAErrorCode.SYSTEM_NOT_FOUND:
                    reply.status(404).send({
                        success: false,
                        message: error.message,
                        code: error.code,
                    });
                    return;

                case SLAErrorCode.SLA_NOT_CONFIGURED:
                    reply.status(404).send({
                        success: false,
                        message: error.message,
                        code: error.code,
                    });
                    return;

                case SLAErrorCode.INVALID_UPTIME_TARGET:
                case SLAErrorCode.INVALID_DOWNTIME_LIMIT:
                    reply.status(400).send({
                        success: false,
                        message: error.message,
                        code: error.code,
                    });
                    return;

                case SLAErrorCode.INSUFFICIENT_DATA:
                    reply.status(422).send({
                        success: false,
                        message: error.message,
                        code: error.code,
                    });
                    return;

                default:
                    reply.status(500).send({
                        success: false,
                        message: 'Erro interno do servidor',
                        code: 'INTERNAL_SERVER_ERROR',
                    });
                    return;
            }
        }

        // Erro genérico
        reply.status(500).send({
            success: false,
            message: 'Erro interno do servidor',
            code: 'INTERNAL_SERVER_ERROR',
        });
    }

    async cleanup(): Promise<void> {
        await this.slaService.disconnect();
    }
}
