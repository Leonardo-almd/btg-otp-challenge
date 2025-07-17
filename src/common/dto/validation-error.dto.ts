import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorItemDto {
  @ApiProperty({
    description: 'Nome da propriedade que falhou na validação',
    example: 'userId'
  })
  property: string;

  @ApiProperty({
    description: 'Mensagem de erro de validação',
    example: 'userId must match /^[0-9]+$/ regular expression'
  })
  message: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    description: 'Data e hora da requisição',
    example: '2025-07-16T19:02:55.338Z'
  })
  timestamp: string;

  @ApiProperty({
    description: 'Caminho da requisição',
    example: '/api/token-otp'
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP',
    example: 'POST'
  })
  method: string;

  @ApiProperty({
    description: 'Mensagem geral de erro',
    example: 'Erro de validação'
  })
  message: string;

  @ApiProperty({
    description: 'Lista de erros de validação',
    type: [ValidationErrorItemDto]
  })
  errors: ValidationErrorItemDto[];
}