// src/config/swagger.config.ts
import { DocumentBuilder, SwaggerModule, SwaggerCustomOptions } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ValidationErrorResponseDto } from '../common/dto/validation-error.dto';
import { ThrottledResponseDto } from '../common/dto/throttled-response.dto';
import { TokenOtpResponseDto } from '../token-otp/adapters/model/token-otp-response.dto';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API Token OTP')
    .setDescription(`
      # API para geração e validação de tokens OTP (One-Time Password)
      
      Esta API permite a criação de tokens OTP (senhas de uso único) associados a um ID de usuário.
      Os tokens gerados são válidos por um período configurável e podem ser usados para autenticação
      em dois fatores ou processos que exigem verificação adicional.
      
      ## Medidas de Segurança
      - Limite de requisições por IP para evitar ataque de força bruta
      - Tokens armazenados de forma segura usando hashing
      - Expiração automática dos tokens
    `)
    .setVersion('1.0')
    .build();

  const options = {
    extraModels: [
      ValidationErrorResponseDto, 
      TokenOtpResponseDto,
      ThrottledResponseDto
    ],
  };

  const document = SwaggerModule.createDocument(app, config, options);

  // Adicionar resposta 429 globalmente a todos os endpoints
  if (document.paths) {
    Object.values(document.paths).forEach(path => {
      Object.values(path).forEach(method => {
        if (!method.responses) {
          method.responses = {};
        }
        
        if (!method.responses['429']) {
          method.responses['429'] = {
            description: 'Limite de requisições excedido. Tente novamente mais tarde.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ThrottledResponseDto'
                }
              }
            }
          };
        }
      });
    });
  }


  SwaggerModule.setup('api/docs', app, document);
}