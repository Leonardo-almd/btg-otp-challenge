import { ApiProperty } from '@nestjs/swagger';

export class ThrottledResponseDto {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 429
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Limite de requisições excedido. Tente novamente mais tarde.'
  })
  message: string;

  @ApiProperty({
    description: 'Tempo em segundos para tentar novamente',
    example: 30
  })
  retryAfter: number;
}