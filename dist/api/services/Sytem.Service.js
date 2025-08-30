"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemService = void 0;
const SystemRepositories_1 = require("../repositories/SystemRepositories");
const ErrorFactory_1 = require("../errors/ErrorFactory");
class SystemService {
    async addSystem(data) {
        const systemExists = await SystemRepositories_1.systemRepository.verifySystemIfExists(data.host);
        if (systemExists) {
            throw ErrorFactory_1.ErrorFactory.systemAlreadyExists();
        }
        return await SystemRepositories_1.systemRepository.addSystem(data);
    }
    async getAllSystems() {
        return await SystemRepositories_1.systemRepository.getAllSystems();
    }
    async getSystemById(id) {
        const system = await SystemRepositories_1.systemRepository.getSystemById(id);
        if (!system) {
            throw ErrorFactory_1.ErrorFactory.systemNotFound();
        }
        return system;
    }
    async deleteSystemById(id) {
        await SystemRepositories_1.systemRepository.deleteSystemById(id);
    }
    async updateSystemById(id, data) {
        const systemExists = await SystemRepositories_1.systemRepository.verifySystemExists(id);
        if (!systemExists) {
            throw ErrorFactory_1.ErrorFactory.systemNotFound();
        }
        return await SystemRepositories_1.systemRepository.updateSystemById(id, data);
    }
}
exports.systemService = new SystemService();
//# sourceMappingURL=Sytem.Service.js.map