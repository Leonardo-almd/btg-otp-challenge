import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ITokenOtpService, TOKEN_OTP_SERVICE } from '../../domain/ports/input/token-otp-service.interface';
import { CreateOtpDto } from '../model/create-token-otp.dto';
import { TokenOtpResponseDto } from '../model/token-otp-response.dto';
import { TokenOtpMapper } from '../model/token-otp-mapper';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidationErrorResponseDto } from '../../../common/dto/validation-error.dto';

@Controller('token-otp')
export class TokenOtpController {
  constructor(
    @Inject(TOKEN_OTP_SERVICE)
    private readonly tokenOtpService: ITokenOtpService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Gera um novo token OTP' })
  @ApiResponse({ 
    status: 400, 
    description: 'Erro de validação nos dados de entrada', 
    type: ValidationErrorResponseDto 
  })
  @ApiResponse({ status: 201, description: 'Token OTP gerado com sucesso', type: TokenOtpResponseDto })
  async create(@Body() createOtpDto: CreateOtpDto): Promise<TokenOtpResponseDto> {
    const otp = await this.tokenOtpService.create(createOtpDto.userId, createOtpDto.expirationMinutes);
    return TokenOtpMapper.toResponseDto(otp);
  }
}
