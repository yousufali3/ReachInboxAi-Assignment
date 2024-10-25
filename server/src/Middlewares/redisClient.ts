import Redis from "ioredis";

import dotenv from "dotenv";
dotenv.config();
const redisConnection = new Redis({
  host:process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
 
});

export { redisConnection };
