import * as express from 'express'
import { config } from '../lib/config'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'

export const router = express.Router({ mergeParams: true })
const logger = log4jui.getLogger('outgoing')

router.post('/', inviteUserRoute)

async function inviteUserRoute(req, res) {
    const orgId = req.session.auth.orgId
    const payload = req.body
    try {
        const response = await http.post(`${config.services.rdProfessionalApi}/organisations/${orgId}/users`, payload)
        logger.info('response::', response.data)
        res.send(response.data)
    } catch (error) {
        logger.info('error', error)
        const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: '' })
        res.send(errReport).status(500)
    }
}
export default router
