import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class ValidateOtpDto {
  @ApiProperty({
    description: 'Token OTP (6 dígitos) para validação',
    example: '123456',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'O token deve conter exatamente 6 dígitos numéricos' })
  token: string;

  @ApiProperty({
    description: 'ID do usuário que está validando o token',
    example: '1234567890',
    maxLength: 10,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @Matches(/^[0-9]+$/, { message: 'O ID do usuário deve conter apenas dígitos numéricos' })
  userId: string;
}