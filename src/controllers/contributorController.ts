import { Request, Response } from 'express';
import { ContributorService } from '../services/contributorService';

export class ContributorController {
  static async getNewContributors(req: Request, res: Response) {
    const { org, repo, year, month } = req.params;
    const contributorService = new ContributorService();

    try {
      const result = await contributorService.fetchAndStoreNewContributors(org, repo, year, month || undefined);

      // Send response including the requested parameters and result
      res.json(result);
    } catch (error) {
      console.error('Error fetching new contributors:', error);
      res.status(500).json({ error: 'An error occurred while fetching new contributors.' });
    }
  }
}
