const _config = {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "",
}

export const ENV_CONFIG = Object.freeze(_config);