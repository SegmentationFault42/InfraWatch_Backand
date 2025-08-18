import { systemRepository } from '../repositories/SystemRepositories.ts';
import { System } from '@prisma/client';

class SystemService {
    async addSystem(
        data: Omit<System, 'id' | 'status' | 'created_at' | 'updated_at'>,
    ) {
        const SystemExists = await systemRepository.verifySystemIfExists(data);

        if (SystemExists) {
            throw new Error('Esse sistema já está cadastrado.');
        }

        try {
            return await systemRepository.addSystem(data);
        } catch (error) {
            throw new Error('Falha ao adicionar sistema.');
        }
    }
    async getAllSystems() {
        const systems = await systemRepository.getAllSystems();
        if (!(systems.length > 0)) throw new Error('Nenhum Sistema Cadastrado');
        return systems;
    }
    async deleteSystemById(id: string) {
        try {
            await systemRepository.deleteSystemById(id);
        } catch (error) {
            throw new Error(`Falha ao eliminar Sistema.\n Tente Novamente`);
        }
    }

    async updateSystemById(id: string, data: Partial<System>) {
        try {
            const system = await systemRepository.verifySystem(id);
            if (!system) return 'Sistema Inexistente';
            await systemRepository.updateSystemById(id, data);
            return 'Sistema actualizado';
        } catch (err) {
            console.error('Erro no service updateSystemById:', err);
            return 'ERROR';
        }
    }
}

export const systemService = new SystemService();
