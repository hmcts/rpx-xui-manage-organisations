import * as express from 'express'
import { getConfigValue } from '../configuration'
import { APP_INSIGHTS_KEY } from '../configuration/references'

export async function handleInstrumentationKeyRoute(req, res) {
    try {
        res.send({key: getConfigValue(APP_INSIGHTS_KEY)})
    } catch (error) {
        const errReport = JSON.stringify({
            apiError: error,
            apiStatusCode: error.statusCode,
            message: 'Instrumentation key route error',
        })
        res.send(errReport).status(error.statusCode)
    }
}

export const router = express.Router({ mergeParams: true })

router.get('/', handleInstrumentationKeyRoute)

export default router
