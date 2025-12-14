"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var databaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    autoLoadEntities: true,
};
exports.default = databaseConfig;
