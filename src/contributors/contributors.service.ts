import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ContributorsRepository } from './contributors.repository';
import { GetNewContributors } from './dtos/get-new-contributors.dto';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { UtilService } from 'src/util/util.service';
import { AxiosError } from 'axios';

@Injectable()
export class ContributorsService {
  private readonly reqHeaders;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly utilService: UtilService,
    private readonly contributorsRepository: ContributorsRepository,
  ) {
    this.reqHeaders = {
      headers: {
        Authorization: `Bearer ${this.configService.get('GITHUB_ACCESS_TOKEN')}`,
      },
    };
  }

  async getNewContributorsByYearAndMonth(
    org: string,
    repo: string,
    year: string,
    month: string,
  ): Promise<GetNewContributors> {
    if (month > '12' || month < '01')
      throw new BadRequestException('Time parameters are incorrect');

    const currentYear = new Date().getFullYear().toString();
    let currentMonth: any = new Date().getMonth() + 1;

    if (currentMonth < 10) {
      currentMonth = currentMonth.toString();
      currentMonth = `0${currentMonth}`;
    }

    console.log('Month', currentMonth);

    if (currentYear < year || (currentYear >= year && currentMonth <= month))
      throw new BadRequestException('Time parameters are incorrect');

    let countOfNewContributors =
      await this.contributorsRepository.findContributorCountPerYearAndMonth(
        year,
        month,
        org,
        repo,
      );

    if (countOfNewContributors !== null) {
      return {
        org,
        repository: repo,
        year,
        month,
        newContributors: countOfNewContributors,
      } as GetNewContributors;
    }

    const allCommitersWithDate = await this.getFirstCommitDateAllContributors(
      org,
      repo,
    );

    const keys = Object.keys(allCommitersWithDate);

    const commitCount: any = {};

    keys.forEach((key, index) => {
      const commitYear = allCommitersWithDate[key].split('-')[0];
      const commitMonth = allCommitersWithDate[key].split('-')[1];

      if (commitCount[commitYear]) {
        if (commitCount[commitYear][commitMonth]) {
          commitCount[commitYear][commitMonth] =
            commitCount[commitYear][commitMonth] + 1;
        } else {
          commitCount[commitYear][commitMonth] = 1;
        }
      } else {
        commitCount[commitYear] = { [commitMonth]: 1 };
      }
    });

    await this.contributorsRepository.createContributorsCountHistory(
      commitCount,
      org,
      repo,
    );

    const contributorCount =
      await this.contributorsRepository.findContributorCountPerYearAndMonth(
        year,
        month,
        org,
        repo,
      );

    return {
      org,
      repository: repo,
      year,
      month,
      newContributors: contributorCount,
    } as GetNewContributors;
  }

  async getNewContributorsByYear(
    org: string,
    repo: string,
    year: string,
  ): Promise<GetNewContributors> {
    const currentYear = new Date().getFullYear().toString();

    if (currentYear < year)
      throw new BadRequestException('Time parameters are incorrect');

    let countOfNewContributors =
      await this.contributorsRepository.findContributorCountPerYear(
        year,
        org,
        repo,
      );

    if (countOfNewContributors !== null) {
      return {
        org,
        repository: repo,
        year,
        newContributors: countOfNewContributors,
      } as GetNewContributors;
    }

    const allCommitersWithDate = await this.getFirstCommitDateAllContributors(
      org,
      repo,
    );

    const keys = Object.keys(allCommitersWithDate);

    const commitCount: any = {};

    keys.forEach((key, index) => {
      const commitYear = allCommitersWithDate[key].split('-')[0];
      const commitMonth = allCommitersWithDate[key].split('-')[1];

      if (commitCount[commitYear]) {
        if (commitCount[commitYear][commitMonth]) {
          commitCount[commitYear][commitMonth] =
            commitCount[commitYear][commitMonth] + 1;
        } else {
          commitCount[commitYear][commitMonth] = 1;
        }
      } else {
        commitCount[commitYear] = { [commitMonth]: 1 };
      }
    });

    console.log(commitCount);

    await this.contributorsRepository.createContributorsCountHistory(
      commitCount,
      org,
      repo,
    );

    const contributorCount =
      await this.contributorsRepository.findContributorCountPerYear(
        year,
        org,
        repo,
      );

    return {
      org,
      repository: repo,
      year,
      newContributors: contributorCount,
    } as GetNewContributors;
  }

  async getFirstCommitDateAllContributors(org, repo): Promise<Object> {
    let nextLink: string = '';
    const allCommitersWithDate = {};
    let contributons;

    do {
      if (nextLink === '') {
        contributons = await firstValueFrom(
          this.httpService
            .get(
              `https://api.github.com/repos/${org}/${repo}/commits?per_page=100`,
              this.reqHeaders,
            )
            .pipe(
              catchError((error: AxiosError) => {
                if (
                  error.response.status === 403 &&
                  error.response.statusText === 'rate limit exceeded'
                ) {
                  const resetTimeRemaining =
                    error.response.headers['x-ratelimit-reset'];
                  let date = new Date(0); // The 0 there is the key, which sets the date to the epoch
                  date.setUTCSeconds(resetTimeRemaining);
                  throw new BadRequestException(
                    `Rate limit exceeded. Retry after ${date}`,
                  );
                }
                throw 'An error happened!';
              }),
            ),
        );
      } else {
        contributons = await firstValueFrom(
          this.httpService.get(nextLink, this.reqHeaders),
        );
      }
      nextLink = this.utilService.extractUrlForNextPage(
        contributons.headers.link,
      );

      contributons.data.forEach((contribution) => {
        allCommitersWithDate[contribution.commit.author.email] =
          contribution.commit.author.date;
      });
    } while (nextLink);

    return allCommitersWithDate;
  }
}
