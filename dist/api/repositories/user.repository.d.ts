import { User } from '@prisma/client';
type CreateUserData = {
    name: string;
    email: string;
    password: string;
    roleId?: string;
};
type UserWithRole = User & {
    role: {
        id: string;
        nome: string;
        description: string | null;
    } | null;
};
declare class UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<UserWithRole | null>;
    create(data: CreateUserData): Promise<UserWithRole>;
    findForLogin(email: string): Promise<Pick<User, 'id' | 'email' | 'password'> | null>;
    update(id: string, data: Partial<CreateUserData>): Promise<UserWithRole>;
    delete(id: string): Promise<void>;
    findAll(skip?: number, take?: number): Promise<UserWithRole[]>;
}
export declare const userRepository: UserRepository;
export {};
//# sourceMappingURL=user.repository.d.ts.map