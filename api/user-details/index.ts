import { exists, valueOrNull } from '../lib/util';
import * as log4jui from '../lib/log4jui';
import { Request, Response, Router } from 'express';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import { getConfigValue } from '../configuration';
import { objectContainsOnlySafeCharacters } from '../lib/util';

const logger = log4jui.getLogger('user-details');

export async function handleUserDetailsRoute(req: Request, res: Response) {
  try {
    const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
    const apiUrl = getRefdataUserDetailsUrl(rdProfessionalApiPath, req.query.userId as string);
    logger.info('User Details API Link: ', apiUrl);
    const response = await req.http.get(apiUrl);
    if (!objectContainsOnlySafeCharacters(response.data)) {
      return res.send('Invalid user details').status(400);
    }
    res.send(response.data);
  } catch (error) {
    logger.error('error', error);
    const status = exists(error, 'statusCode') ? error.statusCode : 500;
    const errReport = {
      apiError: exists(error, 'data.message') ? error.data.message : valueOrNull(error, 'statusText'),
      apiStatusCode: status,
      message: 'User details route error'
    };
    res.status(status).send(errReport);
  }
}

export function getRefdataUserDetailsUrl(rdProfessionalApiPath: string, userId: string): string {
  return `${rdProfessionalApiPath}/refdata/external/v1/organisations/users?returnRoles=true&userIdentifier=${userId}`;
}

export const router = Router({ mergeParams: true });

router.get('/', handleUserDetailsRoute);

export default router;
