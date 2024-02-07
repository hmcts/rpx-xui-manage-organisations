import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_CCD_DATA_STORE_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, valueOrNull } from '../lib/util';

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

export const router = Router({ mergeParams: true });

router.post('/', handleRetriveAccessTypes);

export default router;
