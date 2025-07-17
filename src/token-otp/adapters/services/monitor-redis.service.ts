import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { RedisService } from '../infrastructure/redis/redis.service';

@Injectable()
export class MonitorRedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MonitorRedisService.name);
  private client: any;
  private subscriber: any;

  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getClient();
    this.subscriber = this.redisService.createDuplicate();
  }

  async onModuleInit() {
    try {
      await this.subscriber.connect();
      
      this.logger.log('Redis monitor connected');
      
      // Configurar o Redis para notificar sobre chaves expiradas
      await this.client.configSet('notify-keyspace-events', 'Ex');
      
      // Assinar o canal de eventos de expiração
      await this.subscriber.subscribe('__keyevent@0__:expired', (message) => {
        if (message.startsWith('user:')) {
          const token = message.replace('user:', '');
          this.logger.warn(`Token do usuário ${token} expirou`);
        }
      });
      
      this.logger.log('Redis token expiration monitor started');
   
      this.startPeriodicMonitoring();
    } catch (error) {
      this.logger.error(`Failed to initialize Redis monitor: ${error.message}`, error.stack);
    }
  }

  async onModuleDestroy() {
    try {
      await this.subscriber.unsubscribe();
      await this.subscriber.disconnect();
      this.logger.log('Redis monitor disconnected');
    } catch (error) {
      this.logger.error(`Error disconnecting Redis monitor: ${error.message}`);
    }
  }

  private startPeriodicMonitoring() {
    setInterval(async () => {
      try {
        const keys = await this.client.keys('user:*');
        this.logger.log(`Tokens ativos: ${keys.length}`);
        
        for (const key of keys) {
          const ttl = await this.client.ttl(key);
          const user = key.replace('user:', '');
          
          if (ttl < 60) {
            this.logger.warn(`Token do usuário ${user} irá expirar em ${ttl} segundos`);
          }
        }
      } catch (error) {
        this.logger.error(`Error monitoring tokens: ${error.message}`);
      }
    }, 60000);
  }
} 