import { Body, Controller, HttpCode, HttpException, Inject, InternalServerErrorException, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { ITokenOtpService, TOKEN_OTP_SERVICE } from '../../domain/ports/input/token-otp-service.interface';
import { CreateOtpDto } from '../model/create-token-otp.dto';
import { TokenOtpResponseDto } from '../model/token-otp-response.dto';
import { TokenOtpMapper } from '../model/token-otp-mapper';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidationErrorResponseDto } from '../../../common/dto/validation-error.dto';
import { TokenOtpValidationResponseDto } from '../model/token-otp-validation-response.dto';
import { ValidateOtpDto } from '../model/validate-token-otp.dto';
import { TokenOtpValidationMapper } from '../model/token-otp-validation-mapper';

@Controller('token-otp')
export class TokenOtpController {
  constructor(
    @Inject(TOKEN_OTP_SERVICE)
    private readonly tokenOtpService: ITokenOtpService
  ) { }

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

  @Post('validate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Valida um token OTP existente' })
  @ApiResponse({ status: 400, description: 'Erro de validação nos dados de entrada', type: ValidationErrorResponseDto })
  @ApiResponse({ status: 200, description: 'Token validado com sucesso', type: TokenOtpValidationResponseDto })
  @ApiResponse({ status: 404, description: 'Token não encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  async validate(@Body() validateOtpDto: ValidateOtpDto): Promise<TokenOtpValidationResponseDto> {
    try {
      const validationResult = await this.tokenOtpService.validate(validateOtpDto.token, validateOtpDto.userId);

      if (!validationResult.isValid) {
        if (validationResult.message.includes('não encontrado')) {
          throw new NotFoundException(validationResult.message);
        } else {
          throw new UnauthorizedException(validationResult.message);
        }
      }
      return TokenOtpValidationMapper.toResponseDto(validationResult);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao validar token');
    }
  }
}
