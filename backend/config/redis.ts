import Redis from "ioredis";

export const connectRedis = async (uri: string) => {
  try {
    const redis = new Redis(uri);
    const result = await redis.ping();
    console.log("Redis connection successful:", result);
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
};

export const redis = new Redis(process.env.UPSTASH_REDIS_URL ?? "");
