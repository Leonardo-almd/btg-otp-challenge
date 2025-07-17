import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: any;
  
  constructor(private readonly configService: ConfigService) {
    const redisHost = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const redisPort = this.configService.get<number>('REDIS_PORT') || 6379;
    
    this.client = createClient({
      url: `redis://${redisHost}:${redisPort}`,
    });
  }
  
  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Redis client connected');
    } catch (error) {
      this.logger.error(`Failed to connect to Redis: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  async onModuleDestroy() {
    await this.client.disconnect();
    this.logger.log('Redis client disconnected');
  }
  
  getClient() {
    return this.client;
  }
  
  createDuplicate() {
    return this.client.duplicate();
  }
}