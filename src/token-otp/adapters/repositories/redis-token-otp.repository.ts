import { Injectable, Logger } from '@nestjs/common';
import { TokenOtp } from '../../domain/model/token-otp';
import { ITokenOtpRepository } from '../../domain/ports/output/token-otp-repository.interface';
import { RedisService } from '../infrastructure/redis/redis.service';

@Injectable()
export class RedisTokenOtpRepository implements ITokenOtpRepository {
  private client: any;
  private readonly logger = new Logger(RedisTokenOtpRepository.name);
  
  
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

  async findByUserId(userId: string): Promise<TokenOtp | null> {
    try {
      const key = `user:${userId}`;
      const data = await this.client.get(key);
      
      if (!data) {
        return null;
      }
      
      const tokenData = JSON.parse(data);
      
      if (!tokenData.isValid) {
        return null;
      }
      
      return new TokenOtp({
        token: '',
        tokenHashed: tokenData.token,
        expiresAt: new Date(tokenData.expiresAt),
        isValid: tokenData.isValid,
        userId: tokenData.userId
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar token para usuário ${userId}: ${error.message}`, error.stack);
      return null;
    }
  }

  
  async delete(userId: string): Promise<void> {
    try {
      await this.client.del(`user:${userId}`);
    } catch (error) {
      this.logger.error(`Erro ao atualizar token para usuário ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private calculateTtlInSeconds(expiresAt: Date): number {
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    return Math.max(1, diffSeconds);
  }
}