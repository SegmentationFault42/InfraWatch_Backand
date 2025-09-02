import { Role } from '@prisma/client';
import { prisma } from '../../config/database';

type CreateRoleData = {
    nome: string;
    description?: string;
};

class RoleRepository {
    async findAll(): Promise<Role[]> {
        return await prisma.role.findMany({
            orderBy: { nome: 'asc' },
        });
    }

    async findById(id: string): Promise<Role | null> {
        return await prisma.role.findUnique({
            where: { id },
        });
    }

    async findByName(nome: string): Promise<Role | null> {
        return await prisma.role.findFirst({
            where: {
                nome: {
                    equals: nome,
                    mode: 'insensitive',
                },
            },
        });
    }

    async create(data: CreateRoleData): Promise<Role> {
        return await prisma.role.create({ data });
    }

    async getDefaultViewerRole(): Promise<Role> {
        let viewerRole = await this.findByName('viewer');

        if (!viewerRole) {
            viewerRole = await this.create({
                nome: 'viewer',
                description: 'Role padrão para visualização',
            });
        }

        return viewerRole;
    }
}

export const roleRepository = new RoleRepository();
