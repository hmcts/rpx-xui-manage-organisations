import * as express from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import {exists, valueOrNull} from '../lib/util'

const logger = log4jui.getLogger('service-token')

async function handleUserListRoute(req: express.Request, res: express.Response) {
    const orgId = req.session.auth.orgId
    //for testing hardcode your org id
    //const orgId = 'B13GT1M'
    try {
        const url = `${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations/users`
        const response = await req.http.get(url)
        logger.info('response::', response.data)
        res.send(response.data)
    } catch (error) {
        const errReport = {
            apiError: exists(error, 'data.message') ? error.data.message : valueOrNull(error, 'statusText'),
            apiStatusCode: valueOrNull(error, 'statusCode'),
            message: 'List of users route error',
        }
        res.status(500).send(errReport)
    }
}

export const router = express.Router({ mergeParams: true })

router.get('/', handleUserListRoute)

export default router
