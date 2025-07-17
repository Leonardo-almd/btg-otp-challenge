import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';
import { Request, Response } from 'express';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const validationErrors = exception.validationErrors.map(error => {
      return {
        property: error.property,
        message: Object.values(error.constraints)[0] || 'Erro de validação'
      };
    });
    
    const errorResponse = {
      statusCode: 400,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 'Erro de validação',
      errors: validationErrors
    };
    
    this.logger.error(`Validation error: ${JSON.stringify(validationErrors)}`);
    response.status(400).json(errorResponse);
  }
}