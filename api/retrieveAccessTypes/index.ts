import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_CCD_DATA_STORE_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, valueOrNull } from '../lib/util';
import { processAccessTypes } from './accessTypesComparison';

const logger = log4jui.getLogger('retrive-access-types');

export async function handleRetriveAccessTypes(req: Request, res: Response) {
  const payload = req.body;
  try {
    const ccdDataStore = getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH);
    const url = `${ccdDataStore}/retrieve-access-types`;
    logger.info('RETRIEVE ACCESS TYPES: request URL:: ', url);
    const response = await req.http.post(url, payload);
    logger.info('response::', response.data.jurisdictions);
    res.send(response.data.jurisdictions);
  } catch (error) {
    logger.error(error);
    const status = exists(error, 'status') ? error.status : 500;
    const errReport = {
      apiError: valueOrNull(error, 'data.errorMessage'),
      apiStatusCode: status,
      message: valueOrNull(error, 'data.errorDescription')
    };
    res.status(status).send(errReport);
  }
}

export async function compareAccessTypes(req: Request, res: Response) {
  try {
    const payload = req.body;
    if (!payload || !payload.orgAccessTypes || !payload.userSelections) {
      res.status(400).json({ error: 'Missing required fields in the payload' });
      return;
    }
    const comparedUserSelections = processAccessTypes(payload.orgAccessTypes, payload.userSelections);
    res.json(comparedUserSelections);
  } catch (error) {
    logger.error('Error in compareAccessTypes:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}

export const router = Router({ mergeParams: true });

router.post('/', handleRetriveAccessTypes);
router.post('/compare', compareAccessTypes);
export default router;
