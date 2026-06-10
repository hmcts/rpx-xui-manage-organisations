import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, objectContainsOnlySafeCharacters, valueOrNull } from '../lib/util';
import { getRefdataUserUrl } from '../refdataUserUrlUtil';
import { getUserListErrorLogSummary, getUserListLogSummary } from './userListLogSummary';

const logger = log4jui.getLogger('user-list');

export async function handleUserListRoute(req: Request, res: Response) {
  // Commented out orgId as it is not used
  // const orgId = req.session.auth.orgId
  //for testing hardcode your org id
  //const orgId = 'B13GT1M'
  try {
    const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);

    logger.debug('User list request query', req.query);
    logger.debug('User list request URL', getRefdataUserUrl(rdProfessionalApiPath, req.query.pageNumber as string));
    const apiUrl = getRefdataUserUrl(rdProfessionalApiPath, req.query.pageNumber as string);
    const response = await req.http.get(apiUrl);
    logger.info('User list response received', getUserListLogSummary(response.data));
    if (!objectContainsOnlySafeCharacters(response.data)) {
      return res.send('Invalid user list details').status(400);
    }
    res.send(response.data);
  } catch (error) {
    logger.error('User list route error', getUserListErrorLogSummary(error));
    const status = exists(error, 'statusCode') ? error.statusCode : 500;
    const errReport = {
      apiError: exists(error, 'data.message') ? error.data.message : valueOrNull(error, 'statusText'),
      apiStatusCode: status,
      message: 'List of users route error'
    };
    res.status(status).send(errReport);
  }
}

export const router = Router({ mergeParams: true });

router.get('/', handleUserListRoute);

export default router;
