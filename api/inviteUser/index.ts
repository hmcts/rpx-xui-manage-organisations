import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, valueOrNull } from '../lib/util';
import { getRefdataUserCommonUrlUtil } from '../refdataUserCommonUrlUtil';

export const router = Router({ mergeParams: true });
const logger = log4jui.getLogger('invite-user');

router.post('/', inviteUserRoute);

const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
const reqUrl = getRefdataUserCommonUrlUtil(rdProfessionalApiPath);

export async function inviteUserRoute(req: Request, res: Response) {
  const payload = req.body;
  try {
    logger.info('INVITE USER: request URL:: ', reqUrl);
    logger.info('INVITE USER: payload:: ', payload);
    const response = await req.http.post(reqUrl, payload);
    logger.info('response::', response.data);
    res.send(response.data);
  } catch (error) {
    logger.error('error', error);
    const status = exists(error, 'status') ? error.status : 500;
    const errReport = {
      apiError: valueOrNull(error, 'data.errorMessage'),
      apiStatusCode: status,
      message: valueOrNull(error, 'data.errorDescription')
    };
    res.status(status).send(errReport);
  }
}

export async function inviteUserRouteOGD(req: Request) {
  const payload = req.body.userPayload;
  try {
    logger.info('INVITE USER OGD: request URL:: ', reqUrl);
    const response = await req.http.post(reqUrl, payload);
    logger.info('response::', response.data);
    return (response.data);
  } catch (error) {
    logger.error('error', error);
    const ogdStatus = exists(error, 'status') ? error.status : 500;
    const ogdErrReport = {
      apiError: valueOrNull(error, 'data.errorMessage'),
      apiStatusCode: ogdStatus,
      message: valueOrNull(error, 'data.errorDescription')
    };
    return (ogdErrReport);
  }
}
export default router;
