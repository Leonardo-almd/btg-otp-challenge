import { ApiProperty } from '@nestjs/swagger';

export class ThrottledResponseDto {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 429
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Limite de requisições excedido. Tente novamente em 5 segundos.'
  })
  message: string;
}