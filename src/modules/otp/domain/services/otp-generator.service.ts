import { OtpEntity } from '../entities/otp.entity';

export class OtpGeneratorService {
  generateOtp(userId: string, expirationMinutes: number = 5): OtpEntity {
    const token = this.generateRandomToken();
    const expiresAt = this.calculateExpirationDate(expirationMinutes);
    
    return new OtpEntity(token, expiresAt, userId);
  }

  private generateRandomToken(): string {
    // Gera um token numérico de 6 dígitos
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private calculateExpirationDate(expirationMinutes: number): Date {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);
    return expiresAt;
  }
} 