import { Injectable } from '@nestjs/common';
import { OtpRepositoryPort } from '../../application/ports/otp-repository.port';
import { OtpEntity } from '../../domain/entities/otp.entity';

@Injectable()
export class InMemoryOtpRepository implements OtpRepositoryPort {
  private otps: Map<string, OtpEntity> = new Map();

  async save(otp: OtpEntity): Promise<OtpEntity> {
    this.otps.set(otp.getToken(), otp);
    return otp;
  }

  async findByToken(token: string): Promise<OtpEntity | null> {
    return this.otps.get(token) || null;
  }

  async update(otp: OtpEntity): Promise<OtpEntity> {
    this.otps.set(otp.getToken(), otp);
    return otp;
  }
} 