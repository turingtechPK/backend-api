import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DB_NAME } from '../constants';
import { ContributorsModule } from './contributors/contributors.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    //Configuring ConfigService to be available throughout the project
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    //Connecting MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get<string>('MONGODB_URI')}/${DB_NAME}`,
      }),
      inject: [ConfigService],
    }),

    ContributorsModule,
    UtilModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
