import { NextFunction, Response, Router } from 'express';
import { EnhancedRequest } from '../lib/models';
import { organisationTypes } from './mockOrganisationTypes';

export async function getRegulatoryOrganisationTypes(req: EnhancedRequest, res: Response, next: NextFunction) {
  try {
    res.status(200).send(organisationTypes);
  } catch (error) {
    next(error);
  }
}

export const router = Router({ mergeParams: true });
router.get('/', getRegulatoryOrganisationTypes);

export default router;
