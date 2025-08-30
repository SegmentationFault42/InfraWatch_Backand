import { MonitorType } from '@prisma/client';
export interface MonitorInput {
    type: MonitorType;
    config: Record<string, any>;
    interval?: number;
}
export interface SLAConfigInput {
    uptimeTarget: number;
    maxDowntime?: number;
    responseTimeTarget?: number;
    monitoringWindow?: string;
}
export interface CreateSystemInput {
    name: string;
    host: string;
    alert_email: string;
    monitors?: MonitorInput[];
    slaConfig?: SLAConfigInput;
}
export interface CreateSystemInputStrict {
    name: string;
    host: string;
    alert_email: string;
    monitors?: MonitorInput[] | undefined;
    slaConfig?: SLAConfigInput | undefined;
}
//# sourceMappingURL=system.types.d.ts.map