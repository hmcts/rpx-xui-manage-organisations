import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, valueOrNull } from '../lib/util';
import { getRefdataUserCommonUrlUtil } from '../refdataUserCommonUrlUtil';

export const router = Router({ mergeParams: true });
const logger = log4jui.getLogger('invite-user');

interface InviteUserErrorReport {
  apiError: string | null;
  apiStatusCode: number;
  message: string | null;
}

class InviteUserError extends Error {
  public readonly apiError: string | null;
  public readonly apiStatusCode: number;

  constructor(report: InviteUserErrorReport) {
    super(report.message || report.apiError || 'Invite user request failed');
    this.name = 'InviteUserError';
    this.apiError = report.apiError;
    this.apiStatusCode = report.apiStatusCode;
  }

  public toJSON(): InviteUserErrorReport {
    return {
      apiError: this.apiError,
      apiStatusCode: this.apiStatusCode,
      message: this.message
    };
  }
}

function getInviteUserError(error): InviteUserError {
  const status = exists(error, 'status') ? error.status : 500;
  return new InviteUserError({
    apiError: valueOrNull(error, 'data.errorMessage'),
    apiStatusCode: status,
    message: valueOrNull(error, 'data.errorDescription')
  });
}

router.post('/', inviteUserRoute);

export async function inviteUserRoute(req: Request, res: Response) {
  const payload = req.body;
  try {
    const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
    const reqUrl = getRefdataUserCommonUrlUtil(rdProfessionalApiPath);
    logger.info('INVITE USER: request URL:: ', reqUrl);
    logger.info('INVITE USER: payload:: ', payload);
    const response = await req.http.post(reqUrl, payload);
    logger.info('response::', response.data);
    res.send(response.data);
  } catch (error) {
    const inviteUserError = getInviteUserError(error);
    logger.error('Invite user request failed', inviteUserError);
    res.status(inviteUserError.apiStatusCode).send(inviteUserError.toJSON());
  }
}

export async function inviteUserRouteOGD(req: Request) {
  const payload = req.body.userPayload;
  try {
    const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
    const reqUrl = getRefdataUserCommonUrlUtil(rdProfessionalApiPath);
    logger.info('INVITE USER OGD: request URL:: ', reqUrl);
    const response = await req.http.post(reqUrl, payload);
    logger.info('response::', response.data);
    return (response.data);
  } catch (error) {
    throw getInviteUserError(error);
  }
}
export default router;
