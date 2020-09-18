import * as express from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import {exists, valueOrNull} from '../lib/util'
import { getInviteUserUrl } from './inviteUserUtil'

export const router = express.Router({ mergeParams: true })
const logger = log4jui.getLogger('outgoing')

router.post('/', inviteUserRoute)

async function inviteUserRoute(req, res) {
    const payload = req.body
    try {
        const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)
        const response = await req.http.post(getInviteUserUrl(rdProfessionalApiPath), payload)
        logger.info('response::', response.data)
        res.send(response.data)
    } catch (error) {
        logger.info('error', error)
        const status = exists(error, 'status') ? error.status : 500
        const errReport = {
            apiError: valueOrNull(error, 'data.errorMessage'),
            apiStatusCode: status,
            message: valueOrNull(error, 'data.errorDescription'),
        }
        res.status(status).send(errReport)
    }
}
export default router
