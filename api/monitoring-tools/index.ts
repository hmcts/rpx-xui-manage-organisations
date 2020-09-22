import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { APP_INSIGHTS_KEY } from '../configuration/references'
import {exists} from '../lib/util'

export async function handleInstrumentationKeyRoute(req: Request, res: Response) {
    try {
        res.send({key: getConfigValue(APP_INSIGHTS_KEY)})
    } catch (error) {
        const status = exists(error, 'statusCode') ? error.statusCode : 500
        const errReport = {
            apiError: error,
            apiStatusCode: status,
            message: 'Instrumentation key route error',
        }
        res.status(status).send(errReport)
    }
}

export const router = Router({ mergeParams: true })

router.get('/', handleInstrumentationKeyRoute)

export default router
