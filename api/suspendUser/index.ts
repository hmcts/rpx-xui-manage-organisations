import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import { getRefdataUserUrl } from '../refdataUserUrlUtil'

export const router = Router({ mergeParams: true })
const logger = log4jui.getLogger('suspend-user')

router.put('/', suspendUser)

async function suspendUser(req: Request, res: Response) {
    const payload = req.body
    try {
        const response = await req.http.put(`${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations/users/${req.params.userId}`, payload)
        logger.info('response::', response.data)
        res.send(response.data)
    } catch (error) {
        logger.error('error', error)
        const errReport = {
            apiError: error.data.message,
            apiStatusCode: error.status,
            message: error.data.message,
        }
        res.status(error.status).send(errReport)
    }
}
export default router
