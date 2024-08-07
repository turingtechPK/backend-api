import { AppDataSource } from '../config/db';
import { Repository } from '../models/repository';
import { Contributor } from '../models/contributor';
import { GitHubService } from './githubService';

export class ContributorService {
  // For GitHub API interactions, Initializing 
  private githubService = new GitHubService();

    // Fetches and stores new contributors for a specific repository, organization, year, and month.

  async fetchAndStoreNewContributors(org: string, repoName: string, year: string, month: string = '01') {
    // Fetch all commits for the repository
    const commits = await this.githubService.getCommits(repoName);

    // Initialize a map to track contributors by month-year key
    const contributorsMap = new Map<string, Set<string>>();

    // Access the repositories 
    const contributorRepo = AppDataSource.getRepository(Contributor);
    const repoRepo = AppDataSource.getRepository(Repository);

    // Check if the repository already exists in the database
    let repo = await repoRepo.findOne({ where: { name: repoName, org } });
    if (!repo) {
      // If not, create a new one and save it
      repo = new Repository();
      repo.org = org;
      repo.name = repoName;
      await repoRepo.save(repo);
    }

    // Iterate over all the commits
    for (const commit of commits) {
      // Extract the commit date, year, and month
      const date = new Date(commit.commit.committer.date);
      const commitYear = date.getFullYear().toString();
      const commitMonth = (date.getMonth() + 1).toString().padStart(2, '0');

      // Check if the commit falls within the specified year and month
      if (commitYear === year && commitMonth === month) {
        const monthYear = `${commitYear}-${commitMonth}`;

        if (!contributorsMap.has(monthYear)) {
          contributorsMap.set(monthYear, new Set());
        }

        // Add the contributor's login to the set for the given month-year
        contributorsMap.get(monthYear)!.add(commit?.committer?.login);

        // Create and save a new Contributor entity if not already present
        const newContributor = new Contributor();
        newContributor.githubUsername = commit?.committer?.login || 'ABC'; // In some cases the username was not available so fallback to 'ABC'.
        newContributor.firstCommitDate = date;
        newContributor.repository = repo;
        await contributorRepo.save(newContributor);
      }
    }

    // Prepare the response object with the number of new contributors for the given year and month
    const result: Record<string, number> = {};
    const key = `${year}-${month || ''}`;
    const contributorsSet = contributorsMap.get(key);

    result[key] = contributorsSet ? contributorsSet.size : 0;

    
    return {
      org: org,
      repository: repoName,
      year: year,
      month: month || null,
      newContributors: result
    };
  }
}
