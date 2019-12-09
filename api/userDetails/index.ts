import * as express from 'express'
import { config } from '../lib/config'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'

const logger = log4jui.getLogger('service-token')

async function handleUserDetailsRoute(req, res) {
    try {
        const url = `${config.services.rdProfessionalApi}/refdata/external/v1/organisations/user/${req.params.userId}`
        const response = await http.get(url)
        logger.info('response::', response.data)
        res.send(response.data)
    } catch (error) {
        const errReport = {
            apiError: error.data && error.data.message ? error.data.message : error,
            apiStatusCode: error.statusCode,
            message: 'Details of users route error',
        }
        res.status(500).send(errReport)
    }
}

export const router = express.Router({ mergeParams: true })

router.get('/', handleUserDetailsRoute)

export default router
