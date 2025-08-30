"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRepository = void 0;
const database_1 = require("../../config/database");
class RoleRepository {
    async findAll() {
        return await database_1.prisma.role.findMany({
            orderBy: { nome: 'asc' },
        });
    }
    async findById(id) {
        return await database_1.prisma.role.findUnique({
            where: { id },
        });
    }
    async findByName(nome) {
        return await database_1.prisma.role.findFirst({
            where: {
                nome: {
                    equals: nome,
                    mode: 'insensitive',
                },
            },
        });
    }
    async create(data) {
        return await database_1.prisma.role.create({ data });
    }
    async getDefaultViewerRole() {
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
exports.roleRepository = new RoleRepository();
//# sourceMappingURL=role.repository.js.map