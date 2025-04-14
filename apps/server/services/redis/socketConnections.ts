/**
 * This file is used to configure socket connections
 * We map out the socket connections' id to the socket client's email id
 * This helps us to identify which socket id to send the message to when a message is received via socket
 */

import Redis from "ioredis";
import { ENV_CONFIG } from "../../config/env";

const redis = new Redis(
  `rediss://default:${ENV_CONFIG.REDIS_TOKEN}@${ENV_CONFIG.REDIS_HOST}:${ENV_CONFIG.REDIS_PORT}`
);

const socketConnections = new Map<string, string>();

export const setSocketConnections = async (socketId: string, email: string) => {
  const savedSocketState = await redis.hget("socketConnectionEmailToId", email);

  if (savedSocketState) {
    // delete the old socket connection and add the new one
    await redis.hdel("socketConnectionIdToEmail", savedSocketState);
    await redis.hdel("socketConnectionEmailToId", email);

    await redis.hset("socketConnectionIdToEmail", socketId, email);
    await redis.hset("socketConnectionEmailToId", email, socketId);

    return;
  }

  await redis.hset("socketConnectionIdToEmail", socketId, email);
  await redis.hset("socketConnectionEmailToId", email, socketId);
};

export const getSocketIdFromEmail = (email: string) => {
  return socketConnections.get(email);
};

export const getEmailFromSocketId = (socketId: string) => {
  return socketConnections.get(socketId);
};
