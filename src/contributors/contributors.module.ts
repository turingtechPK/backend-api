import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContributorsController } from './contributors.controller';
import { ContributorsService } from './contributors.service';
import {
  Contributors,
  ContributorsSchema,
} from './entities/contributors.entity';
import { ContributorsRepository } from './contributors.repository';
import { HttpModule } from '@nestjs/axios';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contributors.name, schema: ContributorsSchema },
    ]),
    HttpModule,
    UtilModule,
  ],
  controllers: [ContributorsController],
  providers: [ContributorsService, ContributorsRepository],
})
export class ContributorsModule {}
