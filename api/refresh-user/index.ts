import { Request, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_ROLE_ASSIGNMENT_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, valueOrNull } from '../lib/util';

const logger = log4jui.getLogger('refresh-user');

export async function refreshUser(req: Request) {
  const payload = req.body;
  try {
    const serviceApiBasePath = getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH);
    const reqUrl = `${serviceApiBasePath}/am/role-mapping/professional/refresh`;
    logger.info('REFRESH USER: request URL:: ', reqUrl);
    logger.info('REFRESH USER: payload:: ', payload);
    const response = await req.http.post(reqUrl, payload);
    logger.info('response::', response.data);
    return response.data;
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
