import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import { getRefdataUserUrl } from '../refdataUserUrlUtil'
import {exists, valueOrNull} from '../lib/util'

const logger = log4jui.getLogger('user-list')

export async function handleUserListRoute(req: Request, res: Response) {
    // Commented out orgId as it is not used
    // const orgId = req.session.auth.orgId
    //for testing hardcode your org id
    //const orgId = 'B13GT1M'
    try {
        const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)
        const response = await req.http.get(getRefdataUserUrl(rdProfessionalApiPath))
        logger.info('response::', response.data)
        res.send(response.data)
    } catch (error) {
        logger.error('error', error)
        const status = exists(error, 'statusCode') ? error.statusCode : 500
        const errReport = {
            apiError: exists(error, 'data.message') ? error.data.message : valueOrNull(error, 'statusText'),
            apiStatusCode: status,
            message: 'List of users route error',
        }
        res.status(status).send(errReport)
    }
}

export const router = Router({ mergeParams: true })

router.get('/', handleUserListRoute)

export default router
