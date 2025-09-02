// src/config/database.ts
import { PrismaClient } from '@prisma/client';
import { PrismaClient as TimeseriesClient } from '../../node_modules/.prisma/client-timeseries';

export type RelationalDB = PrismaClient;
export type TimeseriesDB = TimeseriesClient;

export const prisma: RelationalDB = new PrismaClient();
export const timeseries: TimeseriesDB = new TimeseriesClient();

export default prisma;
