import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { ValidationException } from './common/exceptions/validation.exception';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      return new ValidationException(errors);
    }
  }));

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalFilters(new ValidationExceptionFilter());

  app.setGlobalPrefix('api');

  setupSwagger(app);

  const port = process.env.PORT || 3000;

  await app.listen(port);

  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Swagger documentation available at: ${await app.getUrl()}/api/docs`);
}

bootstrap().catch(err => {
  const logger = new Logger('Bootstrap');
  logger.error(`Failed to start application: ${err.message}`, err.stack);
  process.exit(1);
});
