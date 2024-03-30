import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class GetNewContributors {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Facebook',
    description: 'The name of the organization',
    required: true,
    type: String,
  })
  org: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'react',
    description: 'The name of the public github repository of an org',
    required: true,
    type: String,
  })
  repository: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2019',
    description: 'The year in which new contributors are being calculated',
    required: true,
    type: String,
  })
  year: string;

  @IsNumberString()
  @ApiProperty({
    example: '06',
    description:
      'The month of the year in which new contributors are being calculated',
    required: false,
    type: String,
  })
  month?: string;

  @IsNumber()
  @ApiProperty({
    example: 50,
    description: 'The number of new contributors',
    required: true,
    type: Number,
  })
  newContributors: number;
}
