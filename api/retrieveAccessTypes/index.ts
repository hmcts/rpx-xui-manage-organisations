import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_CCD_DATA_STORE_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, valueOrNull } from '../lib/util';
import { processAccessTypes } from './accessTypesComparison';

const logger = log4jui.getLogger('retrive-access-types');

async function fetchAccessTypes(req: Request, payload: any): Promise<any> {
  try {
    const ccdDataStore = getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH);
    const url = `${ccdDataStore}/retrieve-access-types`;
    logger.info('RETRIEVE ACCESS TYPES: request URL:: ', url);
    const response = await req.http.post(url, payload);
    return response.data;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export async function handleRetrieveAccessTypes(req: Request, res: Response) {
  const payload = req.body;
  try {
    const data = await fetchAccessTypes(req, payload);
    res.send(data);
  } catch (error) {
    const status = exists(error, 'status') ? error.status : 500;
    const errReport = {
      apiError: valueOrNull(error, 'data.errorMessage'),
      apiStatusCode: status,
      message: valueOrNull(error, 'data.errorDescription')
    };
    res.status(status).send(errReport);
  }
}

export async function compareAccessTypes(req: Request) {
  try {
    const orgIdPayload = { organisationProfileIds: req.body.orgIdsPayload };
    const userAccessTypesPayload = req.body.userPayload;
    const accessTypes = await fetchAccessTypes(req, orgIdPayload);
    const comparedUserSelections = processAccessTypes(accessTypes.jurisdictions, userAccessTypesPayload);
    return (comparedUserSelections);
  } catch (error) {
    logger.error('Error in compareAccessTypes:', error);
    return ({ error: 'An error occurred while processing your request.' });
  }
}

export const router = Router({ mergeParams: true });

router.post('/', handleRetrieveAccessTypes);
router.post('/compare', compareAccessTypes);
export default router;
