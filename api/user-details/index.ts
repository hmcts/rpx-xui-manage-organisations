import { exists, valueOrNull } from '../lib/util';
import * as log4jui from '../lib/log4jui';
import { Request, Response, Router } from 'express';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import { getConfigValue } from '../configuration';

const logger = log4jui.getLogger('user-details');

export async function handleUserDetailsRoute(req: Request, res: Response) {
    try {
        const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)
        logger.info('user Details API Linkaa: ', getRefdataUserDetailsUrl(rdProfessionalApiPath, req.query.userId as string))
        const response = await req.http.get(getRefdataUserDetailsUrl(rdProfessionalApiPath, req.query.userId as string));
        logger.info('user details response::', response.data);
        res.send(response.data);
    } catch (error) {
        logger.error('error', error);
        const status = exists(error, 'statusCode') ? error.statusCode : 500;
        const errReport = {
            apiError: exists(error, 'data.message') ? error.data.message : valueOrNull(error, 'statusText'),
            apiStatusCode: status,
            message: 'User details route error',
        };
        res.status(status).send(errReport);
    }
}

export function getRefdataUserDetailsUrl(rdProfessionalApiPath: string, userId: string): string {
    return `https://rd-professional-api-pr-1322.preview.platform.hmcts.net/refdata/external/v1/organisations/users?userIdentifier=${userId}`;
}

export const router = Router({ mergeParams: true })

router.get('/', handleUserDetailsRoute)

export default router