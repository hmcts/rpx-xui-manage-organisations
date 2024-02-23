import { Request, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_CCD_DATA_STORE_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, valueOrNull } from '../lib/util';

const logger = log4jui.getLogger('refresh-user');

export async function refreshUser(req: Request) {
  const payload = req.body;
  try {
    // TODO: get the correct url
    const serviceApiBasePath = getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH);
    const reqUrl = `${serviceApiBasePath}/refdata/external/v1/organisations/users/refresh`;
    logger.info('REFRESH USER: request URL:: ', reqUrl);
    logger.info('REFRESH USER: payload:: ', payload);
    // const response = await req.http.post(reqUrl, payload);
    // logger.info('response::', response.data);
    // res.send(response.data);
    return {};
  } catch (error) {
    logger.error('error', error);
    const status = exists(error, 'status') ? error.status : 500;
    const errReport = {
      apiError: valueOrNull(error, 'data.errorMessage'),
      apiStatusCode: status,
      message: valueOrNull(error, 'data.errorDescription')
    };
    return (errReport);
  }
}

export const router = Router({ mergeParams: true });
router.post('/', refreshUser);
export default router;
