import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export class CreateOtpDto {
  @ApiProperty({
    description: 'ID do usuário que solicita o token OTP',
    example: '1234567890',
    maxLength: 10,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @Matches(/^[0-9]+$/)
  userId: string;

  @ApiPropertyOptional({
    description: 'Tempo de expiração do token em minutos (entre 1 e 5)',
    example: 2,
    default: 1,
    minimum: 1,
    maximum: 5,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  expirationMinutes?: number;
} 