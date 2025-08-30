import { Role } from '@prisma/client';
type CreateRoleData = {
    nome: string;
    description?: string;
};
declare class RoleRepository {
    findAll(): Promise<Role[]>;
    findById(id: string): Promise<Role | null>;
    findByName(nome: string): Promise<Role | null>;
    create(data: CreateRoleData): Promise<Role>;
    getDefaultViewerRole(): Promise<Role>;
}
export declare const roleRepository: RoleRepository;
export {};
//# sourceMappingURL=role.repository.d.ts.map