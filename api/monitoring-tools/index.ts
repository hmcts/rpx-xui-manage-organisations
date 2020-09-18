import * as express from 'express'
import { getConfigValue } from '../configuration'
import { APP_INSIGHTS_KEY } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import {exists} from "../lib/util";

const logger = log4jui.getLogger('service-token')

async function handleInstrumentationKeyRoute(req, res) {
    try {
        res.send({key: getConfigValue(APP_INSIGHTS_KEY)})
    } catch (error) {
        const status = exists(error, 'statusCode') ? error.statusCode : 500
        const errReport = {
            apiError: error,
            apiStatusCode: status,
            message: 'List of users route error',
        }
        res.status(status).send(errReport)
    }
}

export const router = express.Router({ mergeParams: true })

router.get('/', handleInstrumentationKeyRoute)

export default router
