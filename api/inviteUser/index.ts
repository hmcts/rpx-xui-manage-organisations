import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import {exists, valueOrNull} from '../lib/util'
import { getRefdataUserUrl } from '../refdataUserUrlUtil'

export const router = Router({ mergeParams: true })
const logger = log4jui.getLogger('invite-user')

router.post('/', inviteUserRoute)

export async function inviteUserRoute(req: Request, res: Response) {
    const payload = req.body
    try {
        const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)
        const response = await req.http.post(getRefdataUserUrl(rdProfessionalApiPath), payload)
        logger.info('response::', response.data)
        res.send(response.data)
    } catch (error) {
        logger.error('error', error)
        const status = exists(error, 'status') ? error.status : 500
        const errReport = {
            apiError: valueOrNull(error, 'data.errorMessage'),
            apiStatusCode: status,
            message: valueOrNull(error, 'data.errorDescription'),
        }
        res.status(status).send(errReport)
    }
}
export default router
