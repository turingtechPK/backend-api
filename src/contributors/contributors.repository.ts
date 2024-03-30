import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  Contributors,
  ContributorsDocument,
} from './entities/contributors.entity';

@Injectable()
export class ContributorsRepository {
  constructor(
    @InjectModel(Contributors.name)
    private contributorsModel: Model<ContributorsDocument>,
  ) {}

  async createContributorsCountHistory(
    commitCount: any,
    org: string,
    repo: string,
  ): Promise<void> {
    const yearKeys = Object.keys(commitCount);

    for (let i = 0; i < yearKeys.length; i++) {
      const monthKeys = Object.keys(commitCount[yearKeys[i]]);

      for (let j = 0; j < monthKeys.length; j++) {
        await this.create({
          org,
          repository: repo,
          year: yearKeys[i],
          month: monthKeys[j],
          newContributors: commitCount[yearKeys[i]][monthKeys[j]],
        } as Contributors);
      }
    }
  }

  async findContributorCountPerYear(
    year: string,
    org: string,
    repo: string,
  ): Promise<number> {
    const contributorsCalculated = await this.contributorsModel.find({
      org,
      repository: repo,
    });

    if (contributorsCalculated.length === 0) return null;

    const contributors = await this.contributorsModel.find({
      org,
      repository: repo,
      year,
    });

    let newContributorCount = 0;
    contributors.forEach((contributor) => {
      newContributorCount = newContributorCount + contributor.newContributors;
    });

    return newContributorCount;
  }

  async findContributorCountPerYearAndMonth(
    year: string,
    month: string,
    org: string,
    repo: string,
  ): Promise<number> {
    const contributorsCalculated = await this.contributorsModel.find({
      org,
      repository: repo,
    });

    if (contributorsCalculated.length === 0) return null;

    const contributors = await this.contributorsModel.findOne({
      org,
      repository: repo,
      year,
      month,
    });

    if (!contributors) return 0;

    return contributors.newContributors;
  }

  async create(contributor: Contributors): Promise<ContributorsDocument> {
    const newContributor = new this.contributorsModel(contributor);
    return newContributor.save();
  }

  async find(
    contributorsFilterQuery: FilterQuery<Contributors>,
  ): Promise<Contributors[]> {
    return this.contributorsModel.find(contributorsFilterQuery);
  }
}
