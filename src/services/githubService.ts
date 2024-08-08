import axios from "axios";
import { retryRequest } from "../utils/retryUtil";

const GITHUB_API_URL = process.env.GITHUB_API_URL || "https://api.github.com";
const ORG_NAME = process.env.ORG_NAME || "airbnb";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

export class GitHubService {
  private readonly headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
  };

  private readonly retryConfig = {
    retries: 3, // Number of times to retry a failed request
    delay: 1000, // Delay between retries in milliseconds (1 second)
    maxTimeout: 120000, // Maximum time to allow retries before failing (2 minutes)
  };

  // Fetches repositories for the specific org using the GitHub API.

  async getRepos() {
    return retryRequest(async () => {
      //Implements retry logic in case of errors or rate limits.
      return axios.get(`${GITHUB_API_URL}/orgs/${ORG_NAME}/repos`, {
        headers: this.headers,
      });
    }, this.retryConfig);
  }

  // Fetches contributors for a specific repository

  async getContributors(repoName: string) {
    return retryRequest(async () => {
      return axios.get(
        `${GITHUB_API_URL}/repos/${ORG_NAME}/${repoName}/contributors`,
        {
          headers: this.headers,
        }
      );
    }, this.retryConfig);
  }

  /**
   * Fetches all commits for a specific repository in the organization.
   * Utilizes pagination to retrieve all available commits, handling GitHub's paginated API.
   */

  async getCommits(repoName: string): Promise<any[]> {
    let allCommits: any[] = []; // Array to accumulate all commits
    let page = 1; // Start with the first page 
    const perPage = 100; // Number of commits per page
    let hasMoreCommits = true;

    // Loop to fetch all pages of commits until no more commits are returned
    while (hasMoreCommits) {
      const response = await retryRequest(async () => {
        return axios.get(
          `${GITHUB_API_URL}/repos/${ORG_NAME}/${repoName}/commits`,
          {
            params: {
              per_page: perPage,
              page: page, // The current page number to fetch
            },
            headers: this.headers, 
          }
        );
      }, this.retryConfig);

      // If the current page has commits, add them to the allCommits array and increment the page number

      if (response.data.length > 0) {
        allCommits = allCommits.concat(response.data);
        page++;
      } else {
        // If no commits are returned, exit
        hasMoreCommits = false;
      }
    }

    return allCommits;
  }
}
