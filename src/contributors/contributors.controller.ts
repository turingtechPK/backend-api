import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ContributorsService } from './contributors.service';
import { GetNewContributors } from './dtos/get-new-contributors.dto';

@ApiTags('Contributors')
@Controller()
export class ContributorsController {
  constructor(private readonly contributorsService: ContributorsService) {}

  @ApiOperation({
    summary:
      'Fetch new contributors in a repository of an org in a specific year',
  })
  @Get(':org/:repo/:year')
  async getNewContributorsPerYear(
    @Param('org') org: string,
    @Param('repo') repo: string,
    @Param('year') year: string,
  ): Promise<GetNewContributors | Error> {
    try {
      return await this.contributorsService.getNewContributorsByYear(
        org,
        repo,
        year,
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @ApiOperation({
    summary:
      'Fetch new contributors in a repository of an org in a specific month of a year',
  })
  @Get(':org/:repo/:year/:month')
  async getNewContributorsPerYearAndMonth(
    @Param('org') org: string,
    @Param('repo') repo: string,
    @Param('year') year: string,
    @Param('month') month: string,
  ): Promise<GetNewContributors | Error> {
    try {
      return await this.contributorsService.getNewContributorsByYearAndMonth(
        org,
        repo,
        year,
        month,
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
