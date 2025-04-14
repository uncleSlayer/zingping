import Reddis, { Redis } from 'ioredis'
import { ENV_CONFIG } from '../../config/env'

export const redisPub = new Reddis(`rediss://default:${ENV_CONFIG.REDIS_TOKEN}@${ENV_CONFIG.REDIS_HOST}:${ENV_CONFIG.REDIS_PORT}`)

export const redisSub = new Redis(`rediss://default:${ENV_CONFIG.REDIS_TOKEN}@${process.env.REDIS_HOST}:${ENV_CONFIG.REDIS_PORT}`)

redisPub.on('error', (err) => console.log('Redis PUB Error', err));
redisSub.on('error', (err) => console.log('Redis SUB Error', err))
