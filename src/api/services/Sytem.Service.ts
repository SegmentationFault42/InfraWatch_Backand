import { systemRepository } from '../repositories/SystemRepositories';
import { System } from '@prisma/client';
import { ErrorFactory } from '../errors/ErrorFactory';
import { CreateSystemInput } from '../types/system.types';

class SystemService {
    async addSystem(data: CreateSystemInput): Promise<System> {
        const systemExists = await systemRepository.verifySystemIfExists(data.host);
        
        if (systemExists) {
            throw ErrorFactory.systemAlreadyExists();
        }

        return await systemRepository.addSystem(data);
    }

    async getAllSystems() {
        return await systemRepository.getAllSystems();
    }

    async getSystemById(id: string): Promise<System> {
        const system = await systemRepository.getSystemById(id);
        
        if (!system) {
            throw ErrorFactory.systemNotFound();
        }
        
        return system;
    }

    async deleteSystemById(id: string): Promise<void> {
        await systemRepository.deleteSystemById(id);
    }

    async updateSystemById(id: string, data: Partial<System>): Promise<System> {
        const systemExists = await systemRepository.verifySystemExists(id);
        
        if (!systemExists) {
            throw ErrorFactory.systemNotFound();
        }

        return await systemRepository.updateSystemById(id, data);
    }
}

export const systemService = new SystemService();