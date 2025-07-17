import { ApiProperty } from "@nestjs/swagger";

export class TokenOtpResponseDto {
  @ApiProperty({
    description: 'Token OTP gerado',
    example: '123456'
  })
  token: string;

  @ApiProperty({
    description: 'Data e hora de expiração do token',
    example: '2023-08-15T14:30:00.000Z'
  })
  expiresAt: Date;

  constructor(token: string, expiresAt: Date) {
    this.token = token;
    this.expiresAt = expiresAt;
  }
} 