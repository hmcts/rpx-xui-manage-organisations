import * as express from 'express'
import { config } from '../lib/config'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'

export const router = express.Router({ mergeParams: true })
const logger = log4jui.getLogger('outgoing')

router.put('/', suspendUser)

async function suspendUser(req, res) {
    const payload = req.body
    try {
        const response = await http.put(`${config.services.rdProfessionalApi}/refdata/external/v1/organisations/users/user/${req.params.userId}`, payload)
        logger.info('response::', response.data)
        res.send(response.data)
    } catch (error) {
        logger.info('error', error)
        const errReport = {
            apiError: error.data.message,
            apiStatusCode: error.status,
            message: error.data.message,
        }
        res.status(error.status).send(errReport)
    }
}
export default router
