import * as express from 'express'
import { config } from '../lib/config'
import * as log4jui from '../lib/log4jui'

const logger = log4jui.getLogger('service-token')

async function handleJurisdictions(req, res) {
    try {
        res.send(config.jurisdictions)
    } catch (error) {
        const errReport = JSON.stringify({
            apiError: error,
            apiStatusCode: error.statusCode,
            message: 'List of jurisdictions route error',
        })
        res.send(errReport).status(500)
    }
}

export const router = express.Router({ mergeParams: true })

router.get('/', handleJurisdictions)

export default router
