import Redis from 'ioredis';
import { logger } from './logger';

let redisClient: Redis;

export async function connectRedis(): Promise<Redis> {
  try {
    redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        return err.message.includes(targetError);
      }
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redisClient.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    await redisClient.ping();
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export function getRedisClient(): Redis {
  if (!redisClient) {
    throw new Error('Redis not initialized. Call connectRedis() first.');
  }
  return redisClient;
}

// Cache utilities
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = getRedisClient();
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, serializedValue);
    } else {
      await this.redis.set(key, serializedValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('Error parsing cached value:', error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async increment(key: string, by: number = 1): Promise<number> {
    return await this.redis.incrby(key, by);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  async getPattern(pattern: string): Promise<string[]> {
    return await this.redis.keys(pattern);
  }

  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.getPattern(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // Session management
  async setSession(sessionId: string, data: any, ttl: number = 3600): Promise<void> {
    await this.set(`session:${sessionId}`, data, ttl);
  }

  async getSession<T>(sessionId: string): Promise<T | null> {
    return await this.get<T>(`session:${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.delete(`session:${sessionId}`);
  }

  // Rate limiting
  async isRateLimited(key: string, limit: number, window: number): Promise<{ limited: boolean; remaining: number }> {
    const current = await this.increment(`rate:${key}`);
    
    if (current === 1) {
      await this.expire(`rate:${key}`, window);
    }
    
    const remaining = Math.max(0, limit - current);
    return {
      limited: current > limit,
      remaining
    };
  }

  // Pub/Sub for real-time features
  async publish(channel: string, message: any): Promise<void> {
    await this.redis.publish(channel, JSON.stringify(message));
  }

  subscribe(channel: string, callback: (message: any) => void): void {
    const subscriber = this.redis.duplicate();
    subscriber.subscribe(channel);
    
    subscriber.on('message', (receivedChannel, message) => {
      if (receivedChannel === channel) {
        try {
          const parsedMessage = JSON.parse(message);
          callback(parsedMessage);
        } catch (error) {
          logger.error('Error parsing pub/sub message:', error);
        }
      }
    });
  }
}

export { redisClient };