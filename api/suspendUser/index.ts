import * as express from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import * as log4jui from '../lib/log4jui'

export const router = express.Router({ mergeParams: true })
const logger = log4jui.getLogger('outgoing')

router.put('/', suspendUser)

async function suspendUser(req: express.Request, res: express.Response) {
    const payload = req.body
    try {
        const response = await req.http.put(`${getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)}/refdata/external/v1/organisations/users/${req.params.userId}`, payload)
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
