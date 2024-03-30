import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Contributors extends Document {
  @Prop({ required: true })
  @ApiProperty({
    example: 'Facebook',
    description: 'The name of the organization',
    required: true,
    type: String,
  })
  org: string;

  @Prop({ required: true })
  @ApiProperty({
    example: 'react',
    description: 'The name of the public github repository of an org',
    required: true,
    type: String,
  })
  repository: string;

  @Prop({ required: true })
  @ApiProperty({
    example: '2019',
    description: 'The year in which new contributors are being calculated',
    required: true,
    type: String,
  })
  year: string;

  @Prop({ required: true })
  @ApiProperty({
    example: '06',
    description:
      'The month of the year in which new contributors are being calculated',
    required: true,
    type: String,
  })
  month: string;

  @Prop({ required: true })
  @ApiProperty({
    example: 50,
    description: 'The number of new contributors',
    required: true,
    type: Number,
  })
  newContributors: number;
}

export const ContributorsSchema = SchemaFactory.createForClass(Contributors);
export type ContributorsDocument = Contributors & Document;
