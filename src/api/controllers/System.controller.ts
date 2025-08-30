import { systemService } from '../services/Sytem.Service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { systemValidation } from '../validations/system.validation';
import { System } from '@prisma/client';
import { auditLogService } from '../services/AuditLog.Service';
import { SystemError } from '../errors/SystemError';

class SystemController {
    async addSystem(req: FastifyRequest, res: FastifyReply) {
        try {
            const data = systemValidation.createSystemSchema.parse(req.body);
            const system = await systemService.addSystem(data);
            console.log('chegou');
            await auditLogService.logRequest({
                user_id: req.user?.id ?? null,
                action: 'CREATE',
                object_type: 'system',
                object_id: system.id,
                details: {
                    body: req.body,
                    url: req.url,
                    method: req.method,
                },
            });

            return res.status(201).send({
                message: 'Sistema adicionado com sucesso',
                data: system,
            });
        } catch (error) {
            return this.handleError(error, res);
        }
    }

    async getAllSystems(req: FastifyRequest, res: FastifyReply) {
        try {
            const systems = await systemService.getAllSystems();

            return res.status(200).send({
                data: systems,
                count: systems.length,
            });
        } catch (error) {
            return this.handleError(error, res);
        }
    }

    async getSystemById(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id } = systemValidation.getById.parse(req.params);
            const system = await systemService.getSystemById(id);
            console.log(system);
            return res.status(200).send({ data: system });
        } catch (error) {
            return this.handleError(error, res);
        }
    }

    async deleteSystemById(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id } = systemValidation.getById.parse(req.params);
            await systemService.deleteSystemById(id);
            return res.status(200).send({
                message: 'Sistema removido com sucesso',
            });
        } catch (error) {
            return this.handleError(error, res);
        }
    }

    async updateSystemById(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id } = systemValidation.getById.parse(req.params);
            const updateData = systemValidation.getByUpdate.parse(req.body);

            const updatedSystem = await systemService.updateSystemById(
                id,
                updateData as Partial<System>,
            );

            return res.status(200).send({
                message: 'Sistema atualizado com sucesso',
                data: updatedSystem,
            });
        } catch (error) {
            return this.handleError(error, res);
        }
    }

    private handleError(error: unknown, res: FastifyReply) {
        console.error('Controller error:', error);

        if (error instanceof z.ZodError) {
            return res.status(400).send({
                error: 'Validação falhou',
            });
        }

        if (error instanceof SystemError) {
            return res.status(error.statusCode).send({
                error: error.message,
                code: error.code,
                ...(error.details && { details: error.details }),
            });
        }

        return res.status(500).send({
            error: 'Erro interno no servidor',
            message: 'Algo deu errado, tente novamente mais tarde.',
        });
    }
}

export const systemController = new SystemController();
