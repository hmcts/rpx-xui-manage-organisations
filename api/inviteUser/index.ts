import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import { getInviteUserUrl } from './inviteUserUtil'

export const router = Router({ mergeParams: true })
const logger = log4jui.getLogger('invite-user')

router.post('/', inviteUserRoute)

async function inviteUserRoute(req, res) {
    const payload = req.body
    try {
        const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)
        const response = await req.http.post(getInviteUserUrl(rdProfessionalApiPath), payload)
        logger.info('response::', response.data)
        res.send(response.data)
    } catch (error) {
        logger.error('error', error)
        const errReport = {
            apiError: error.data.errorMessage,
            apiStatusCode: error.status,
            message: error.data.errorDescription,
        }
        res.status(error.status).send(errReport)
    }
}
export default router
