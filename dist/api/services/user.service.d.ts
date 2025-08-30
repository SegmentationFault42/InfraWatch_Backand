type CreateUserData = {
    name: string;
    email: string;
    password: string;
    roleId?: string;
};
type LoginResponse = {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: {
            id: string;
            nome: string;
            description: string | null;
        } | null;
    };
};
declare class UserService {
    createUser(data: CreateUserData): Promise<{
        name: string;
        id: string;
        email: string;
        roleId: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: {
            id: string;
            nome: string;
            description: string | null;
        } | null;
    }>;
    loginUser(email: string, password: string): Promise<LoginResponse>;
    getUserById(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        roleId: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: {
            id: string;
            nome: string;
            description: string | null;
        } | null;
    }>;
}
export declare const userService: UserService;
export {};
//# sourceMappingURL=user.service.d.ts.map