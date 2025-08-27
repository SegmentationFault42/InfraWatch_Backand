import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    PORT: Number(process.env.Port) || 3333,
    JWT_SECRET:
        process.env.JWT_SECRET || '91bfe63e-8995-4fcc-b93b-91f16ecf1a96',
    NODE_ENV: process.env.NODE_ENV,
    HOST: process.env.HOST || '0.0.0.0',
    COOKIE_SECRET:
        process.env.COOKIE_SECRET || '085c061f-ce24-411c-bef8-cc6eec4bf686',
};
