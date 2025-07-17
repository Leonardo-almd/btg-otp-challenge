import { Module } from '@nestjs/common';
import { TokenOtpController } from './adapters/controllers/token-otp.controller';
import { RedisTokenOtpRepository } from './adapters/repositories/redis-token-otp.repository';
import { MonitorRedisService } from './adapters/services/monitor-redis.service';
import { TOKEN_OTP_REPOSITORY } from './domain/ports/output/token-otp-repository.interface';
import { TOKEN_OTP_SERVICE } from './domain/ports/input/token-otp-service.interface';
import { TokenOtpService } from './domain/ports/input/token-otp.service';
import { CryptoHashingService } from './adapters/services/crypto-hashing.service';
import { TOKEN_HASHING_PORT } from './domain/ports/output/token-hashing.port';
import { RedisModule } from './adapters/infrastructure/redis/redis.module';
import { RedisService } from './adapters/infrastructure/redis/redis.service';

@Module({
  imports: [RedisModule],
  controllers: [TokenOtpController],
  providers: [
    {
      provide: TOKEN_OTP_SERVICE,
      useClass: TokenOtpService,
    },
    {
      provide: TOKEN_HASHING_PORT,
      useClass: CryptoHashingService,
    },
    {
      provide: TOKEN_OTP_REPOSITORY,
      useFactory: (redisService: RedisService) => {
        return new RedisTokenOtpRepository(redisService);
      },
      inject: [RedisService],
    },
    {
      provide: MonitorRedisService,
      useFactory: (redisService: RedisService) => {
        return new MonitorRedisService(redisService);
      },
      inject: [RedisService],
    },
  ],
  exports: [RedisModule]
})
export class TokenOtpModule { }
