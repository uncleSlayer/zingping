import dotenv from 'dotenv'

function getEnv() {
    
    dotenv.config()

    const _config = {
        DATABASE_URL: process.env.DATABASE_URL || "",
        JWT_SECRET: process.env.JWT_SECRET || "",
    }

    if (!_config.DATABASE_URL.length) {
        throw new Error("DATABASE_URL is not set");
    } else if (!_config.JWT_SECRET.length) {
        throw new Error("JWT_SECRET is not set");
    } 

    return _config;
}


export const ENV_CONFIG = Object.freeze(getEnv());