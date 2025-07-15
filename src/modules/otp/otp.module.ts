import { Module } from '@nestjs/common';
import { OtpController } from './infrastructure/controllers/otp.controller';
import { CreateOtpUseCase } from './application/use-cases/create-otp.use-case';
import { OtpGeneratorService } from './domain/services/otp-generator.service';
import { InMemoryOtpRepository } from './infrastructure/repositories/in-memory-otp.repository';
import { OTP_REPOSITORY_TOKEN } from './application/ports/otp-repository.port';

@Module({
  controllers: [OtpController],
  providers: [
    CreateOtpUseCase,
    OtpGeneratorService,
    {
      provide: OTP_REPOSITORY_TOKEN,
      useClass: InMemoryOtpRepository,
    },
  ],
})
export class OtpModule {} 