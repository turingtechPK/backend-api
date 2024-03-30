import { DocumentBuilder } from '@nestjs/swagger';

export const DB_NAME: string = 'turing_test';
export const SWAGGER_CONFIG = new DocumentBuilder()
  .setTitle('Turing Test')
  .setDescription('The API description for the Turing Test')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

export const SWAGGER_URL = 'api/v1/swagger';
