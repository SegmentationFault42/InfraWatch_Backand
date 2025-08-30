"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemController = void 0;
const Sytem_Service_1 = require("../services/Sytem.Service");
const zod_1 = require("zod");
const system_validation_1 = require("../validations/system.validation");
const AuditLog_Service_1 = require("../services/AuditLog.Service");
const SystemError_1 = require("../errors/SystemError");
class SystemController {
    async addSystem(req, res) {
        try {
            const data = system_validation_1.systemValidation.createSystemSchema.parse(req.body);
            const system = await Sytem_Service_1.systemService.addSystem(data);
            console.log('chegou');
            await AuditLog_Service_1.auditLogService.logRequest({
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
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async getAllSystems(req, res) {
        try {
            const systems = await Sytem_Service_1.systemService.getAllSystems();
            return res.status(200).send({
                data: systems,
                count: systems.length,
            });
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async getSystemById(req, res) {
        try {
            const { id } = system_validation_1.systemValidation.getById.parse(req.params);
            const system = await Sytem_Service_1.systemService.getSystemById(id);
            console.log(system);
            return res.status(200).send({ data: system });
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async deleteSystemById(req, res) {
        try {
            const { id } = system_validation_1.systemValidation.getById.parse(req.params);
            await Sytem_Service_1.systemService.deleteSystemById(id);
            return res.status(200).send({
                message: 'Sistema removido com sucesso',
            });
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    async updateSystemById(req, res) {
        try {
            const { id } = system_validation_1.systemValidation.getById.parse(req.params);
            const updateData = system_validation_1.systemValidation.getByUpdate.parse(req.body);
            const updatedSystem = await Sytem_Service_1.systemService.updateSystemById(id, updateData);
            return res.status(200).send({
                message: 'Sistema atualizado com sucesso',
                data: updatedSystem,
            });
        }
        catch (error) {
            return this.handleError(error, res);
        }
    }
    handleError(error, res) {
        console.error('Controller error:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).send({
                error: 'Validação falhou',
            });
        }
        if (error instanceof SystemError_1.SystemError) {
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
exports.systemController = new SystemController();
//# sourceMappingURL=System.controller.js.map