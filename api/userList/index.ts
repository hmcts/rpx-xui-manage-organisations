import * as log4jui from '../lib/log4jui'
import * as express from 'express'
import { config } from '../lib/config'
import { http } from '../lib/http'

const logger = log4jui.getLogger('service-token')

async function handleUserListRoute(req, res) {
    const orgId = req.session.auth.orgId
    //for testing hardcode your org id
    //const orgId = 'B13GT1M'
    try {
        const response = await http.get(`${config.services.rdProfessionalApi}/refdata/internal/v1/organisations/${orgId}/users`)
        logger.info('response::', response.data)
        res.send(response.data)
    } catch (error) {
        const errReport = JSON.stringify({
            apiError: error,
            apiStatusCode: error.statusCode,
            message: 'List of users route error',
        })
        res.send(errReport).status(500)
    }
}

export const router = express.Router({ mergeParams: true })

router.get('/', handleUserListRoute)

export default router
