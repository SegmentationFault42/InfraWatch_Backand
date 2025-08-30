import { System, Prisma } from '@prisma/client';
import { CreateSystemInput } from '../types/system.types';
declare class SystemRepository {
    verifySystemIfExists(host: string): Promise<System | null>;
    addSystem(data: CreateSystemInput): Promise<System>;
    getAllSystems(): Promise<{
        host: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.status;
        alert_email: string;
        monitors: {
            config: Prisma.JsonValue;
            type: import(".prisma/client").$Enums.MonitorType;
            id: string;
            interval: number | null;
        }[];
    }[]>;
    getSystemById(id: string): Promise<System | null>;
    deleteSystemById(id: string): Promise<void>;
    verifySystemExists(id: string): Promise<boolean>;
    updateSystemById(id: string, data: Partial<System>): Promise<System>;
}
export declare const systemRepository: SystemRepository;
export {};
//# sourceMappingURL=SystemRepositories.d.ts.map