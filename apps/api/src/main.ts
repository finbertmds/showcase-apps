import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://yourdomain.com',
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.error('Validation Errors:', errors);
        return new BadRequestException(errors);
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  const port = configService.get('PORT', 4000);
  await app.listen(port);
  
  console.log(`🚀 API server running on: http://localhost:${port}/graphql`);
}

bootstrap();
