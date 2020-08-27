import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import { getRefdataUserUrl } from '../refdataUserUrlUtil'

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
        const errReport = {
            apiError: error.data && error.data.message ? error.data.message : error.statusText,
            apiStatusCode: error.statusCode,
            message: 'List of users route error',
        }
        res.status(errReport.apiStatusCode).send(errReport)
    }
}

export const router = Router({ mergeParams: true })

router.get('/', handleUserListRoute)

export default router
