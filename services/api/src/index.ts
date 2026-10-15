import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './exceptions/global-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Middleware and global configurations
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Integrated Legal Client Portal API')
    .setDescription('A comprehensive API for all endpoints of the Integrated Legal Client Portal')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory); // Available at /api

  // Start the server
  const port = 3001;
  await app.listen(port);
  console.log(`API server running on http://localhost:${port}`);
}

void bootstrap();
