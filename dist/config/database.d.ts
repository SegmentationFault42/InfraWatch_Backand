import { PrismaClient } from '@prisma/client';
import { PrismaClient as TimeseriesClient } from '../../node_modules/.prisma/client-timeseries';
export type RelationalDB = PrismaClient;
export type TimeseriesDB = TimeseriesClient;
export declare const prisma: RelationalDB;
export declare const timeseries: TimeseriesDB;
export default prisma;
//# sourceMappingURL=database.d.ts.map