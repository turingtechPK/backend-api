import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CONFIG, SWAGGER_URL } from '../constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, SWAGGER_CONFIG);
  SwaggerModule.setup(SWAGGER_URL, app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 3000;
  await app.listen(PORT);
}
bootstrap();
