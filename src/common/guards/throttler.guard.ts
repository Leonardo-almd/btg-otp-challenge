import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    const ip = 
      req.headers['x-forwarded-for']?.toString() || 
      req.connection.remoteAddress ||
      req.socket.remoteAddress;
    
    return `${ip}-${req.method}-${req.url}`;
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: {
      limit: number;
      ttl: number;
      totalHits: number;
      timeToExpire: number;
    },
  ): Promise<void> {
    const retryAfterSeconds = Math.ceil(throttlerLimitDetail.timeToExpire);
    
    throw new ThrottlerException(`Limite de requisições excedido. Tente novamente em ${retryAfterSeconds} segundos.`);
  }
}