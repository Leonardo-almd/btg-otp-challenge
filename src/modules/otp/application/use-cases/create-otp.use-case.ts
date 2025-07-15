import { Inject, Injectable } from '@nestjs/common';
import { OtpEntity } from '../../domain/entities/otp.entity';
import { OtpGeneratorService } from '../../domain/services/otp-generator.service';
import { OTP_REPOSITORY_TOKEN, OtpRepositoryPort } from '../ports/otp-repository.port';

export interface CreateOtpDto {
  userId: string;
}

export interface CreateOtpResponseDto {
  token: string;
  expiresAt: Date;
}

@Injectable()
export class CreateOtpUseCase {
  constructor(
    private readonly otpGeneratorService: OtpGeneratorService,
    @Inject(OTP_REPOSITORY_TOKEN)
    private readonly otpRepository: OtpRepositoryPort,
  ) {}

  async execute(dto: CreateOtpDto): Promise<CreateOtpResponseDto> {
    const otp = this.otpGeneratorService.generateOtp(dto.userId);
    const savedOtp = await this.otpRepository.save(otp);

    return {
      token: savedOtp.getToken(),
      expiresAt: savedOtp.getExpiresAt(),
    };
  }
} 