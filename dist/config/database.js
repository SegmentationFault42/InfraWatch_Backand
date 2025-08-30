"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeseries = exports.prisma = void 0;
// src/config/database.ts
const client_1 = require("@prisma/client");
const client_timeseries_1 = require("../../node_modules/.prisma/client-timeseries");
exports.prisma = new client_1.PrismaClient();
exports.timeseries = new client_timeseries_1.PrismaClient();
exports.default = exports.prisma;
//# sourceMappingURL=database.js.map