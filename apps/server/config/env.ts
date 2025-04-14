import dotenv from 'dotenv'

function getEnv() {
    
    dotenv.config()

    const _config = {
        DATABASE_URL: process.env.DATABASE_URL || "",
        JWT_SECRET: process.env.JWT_SECRET || "",
        REDIS_HOST: process.env.REDIS_HOST || "",
        REDIS_PORT: process.env.REDIS_PORT || "",
        REDIS_TOKEN: process.env.REDIS_TOKEN || "",
    }

    // TODO: later replace this if else check with zod validation
    if (!_config.DATABASE_URL.length) {
        throw new Error("DATABASE_URL is not set");
    } else if (!_config.JWT_SECRET.length) {
        throw new Error("JWT_SECRET is not set");
    } else if (!_config.REDIS_HOST.length) {
        throw new Error("REDIS_HOST is not set");
    } else if (!_config.REDIS_PORT.length) {
        throw new Error("REDIS_PORT is not set");
    }

    return _config;
}


export const ENV_CONFIG = Object.freeze(getEnv());