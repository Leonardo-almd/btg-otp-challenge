import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenOtpModule } from './token-otp/token-otp.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './common/guards/throttler.guard';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [TokenOtpModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisHost = config.get<string>('REDIS_HOST') || 'localhost';
        const redisPort = config.get<number>('REDIS_PORT') || 6379;

        return {
          throttlers: [
            {
              ttl: config.get<number>('THROTTLE_TTL') || 5000,
              limit: config.get<number>('THROTTLE_LIMIT') || 1,
            },
          ],
          storage: new ThrottlerStorageRedisService(new Redis({ port: redisPort, host: redisHost }))
        }
      },
    }),
    TokenOtpModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    }
  ],
})
export class AppModule { }
