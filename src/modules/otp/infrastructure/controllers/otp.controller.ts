import { Body, Controller, Post } from '@nestjs/common';
import { CreateOtpDto, CreateOtpResponseDto, CreateOtpUseCase } from '../../application/use-cases/create-otp.use-case';

@Controller('otp')
export class OtpController {
  constructor(private readonly createOtpUseCase: CreateOtpUseCase) {}

  @Post()
  async createOtp(@Body() createOtpDto: CreateOtpDto): Promise<CreateOtpResponseDto> {
    return this.createOtpUseCase.execute(createOtpDto);
  }
} 