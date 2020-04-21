import * as express from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'
import { getInviteUserUrl } from './inviteUserUtil'

export const router = express.Router({ mergeParams: true })
const logger = log4jui.getLogger('outgoing')

router.post('/', inviteUserRoute)

async function inviteUserRoute(req, res) {
    const payload = req.body
    try {
        const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)
        const response = await http.post(getInviteUserUrl(rdProfessionalApiPath), payload)
        logger.info('response::', response.data)
        res.send(response.data)
    } catch (error) {
        logger.info('error', error)
        const errReport = {
            apiError: error.data.errorMessage,
            apiStatusCode: error.status,
            message: error.data.errorDescription,
        }
        res.status(error.status).send(errReport)
    }
}
export default router
