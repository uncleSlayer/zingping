const _config = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
};

export const ENV_CONFIG = Object.freeze(_config);
