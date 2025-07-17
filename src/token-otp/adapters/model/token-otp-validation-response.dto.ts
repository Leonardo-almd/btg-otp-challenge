import { ApiProperty } from "@nestjs/swagger";

export class TokenOtpValidationResponseDto {
  @ApiProperty({
    description: 'Indica se o token é válido',
    example: true
  })
  isValid: boolean;

  @ApiProperty({
    description: 'ID do usuário associado ao token (retornado apenas para tokens válidos)',
    example: '123456',
    required: false
  })
  userId?: string;

  @ApiProperty({
    description: 'Mensagem informativa sobre o resultado da validação',
    example: 'Token válido.'
  })
  message: string;

  constructor(isValid: boolean, message: string, userId?: string) {
    this.isValid = isValid;
    this.message = message;
    if (userId) {
      this.userId = userId;
    }
  }
}