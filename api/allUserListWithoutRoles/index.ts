import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, valueOrNull } from '../lib/util';
import { getRefdataAllUserListUrl } from '../refdataAllUserListUrlUtil';

const logger = log4jui.getLogger('user-list');

export async function handleAllUserListRoute(req: Request, res: Response) {
  try {
    const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
    const response = await req.http.get(getRefdataAllUserListUrl(rdProfessionalApiPath));
    res.send(response.data);
  } catch (error) {
    logger.error('error', error);
    const status = exists(error, 'statusCode') ? error.statusCode : 500;
    const errReport = {
      apiError: exists(error, 'data.message') ? error.data.message : valueOrNull(error, 'statusText'),
      apiStatusCode: status,
      message: 'All List of users route error'
    };
    res.status(status).send(errReport);
  }
}

export const router = Router({ mergeParams: true });

router.get('/', handleAllUserListRoute);

export default router;
