import { System } from '@prisma/client';
import { CreateSystemInput } from '../types/system.types';
declare class SystemService {
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
            config: import("@prisma/client/runtime/library").JsonValue;
            type: import(".prisma/client").$Enums.MonitorType;
            id: string;
            interval: number | null;
        }[];
    }[]>;
    getSystemById(id: string): Promise<System>;
    deleteSystemById(id: string): Promise<void>;
    updateSystemById(id: string, data: Partial<System>): Promise<System>;
}
export declare const systemService: SystemService;
export {};
//# sourceMappingURL=Sytem.Service.d.ts.map