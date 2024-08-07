import { Router } from 'express';
import { ContributorController } from '../controllers/contributorController';

const router = Router();

router.get('/:org/:repo/:year/:month?', ContributorController.getNewContributors);

export default router;
