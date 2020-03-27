import * as express from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'

export const router = express.Router({ mergeParams: true })
const logger = log4jui.getLogger('outgoing')

router.post('/', inviteUserRoute)

async function inviteUserRoute(req, res) {
    const orgId = req.session.auth.orgId
    const payload = req.body
    let reinviteString = ''
    if (payload && payload.isReinvite) {
      reinviteString = 'resendinvite'
    }
    try {
        const response = await http.post(`${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations/users/${reinviteString}`, payload)
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
