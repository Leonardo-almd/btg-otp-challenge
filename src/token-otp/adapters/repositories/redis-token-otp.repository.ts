import { Injectable } from '@nestjs/common';
import { TokenOtp } from '../../domain/model/token-otp';
import { ITokenOtpRepository } from '../../domain/ports/output/token-otp-repository.interface';
import { RedisService } from '../infrastructure/redis/redis.service';

@Injectable()
export class RedisTokenOtpRepository implements ITokenOtpRepository {
  private client: any;
  
  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getClient();
  }

  async create(otp: TokenOtp): Promise<TokenOtp> {
    const key = `user:${otp.getUserId()}`;
    const ttlInSeconds = this.calculateTtlInSeconds(otp.getExpiresAt());
    
    await this.client.set(key, JSON.stringify({
      token: otp.getTokenHashed(),
      userId: otp.getUserId(),
      expiresAt: otp.getExpiresAt().toISOString(),
      isValid: true,
    }), { EX: ttlInSeconds });
    
    return otp;
  }

  private calculateTtlInSeconds(expiresAt: Date): number {
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    return Math.max(1, diffSeconds);
  }
}