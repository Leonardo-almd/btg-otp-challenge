import { OtpEntity } from '../../domain/entities/otp.entity';

export const OTP_REPOSITORY_TOKEN = 'OTP_REPOSITORY_TOKEN';

export interface OtpRepositoryPort {
  save(otp: OtpEntity): Promise<OtpEntity>;
  findByToken(token: string): Promise<OtpEntity | null>;
  update(otp: OtpEntity): Promise<OtpEntity>;
} 