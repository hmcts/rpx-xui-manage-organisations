import * as express from 'express'
import { config } from '../lib/config'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'

export const router = express.Router({ mergeParams: true })
const logger = log4jui.getLogger('outgoing')

router.put('', inviteUserRoute)

async function inviteUserRoute(req, res) {
    let errReport: any
    if (!req.params.userId) {
        errReport = getErrorReport('UserId is missing', '500', 'User Permissions route error')
        res.status(500).send(errReport)
        return
    }
    const payload = req.body
    try {
      const response = await http.put(getEditPermissionsUrl(config.services.rdProfessionalApi, req.params.userId), payload)
      logger.info('response::', response.data)
      res.send(response.data)
    } catch (error) {
        logger.info('error', error)
        errReport = getErrorReport(getErrorMessage(error), error.status, getErrorMessage(error))
        res.status(error.status).send(errReport)
    }
}

function getErrorMessage(error: any): string {
    return error && error.data ? error.data.message : ''
}
function getErrorReport(apiError: string, apiStatusCode: string, message: string): any {
    return {
        apiError,
        apiStatusCode,
        message,
    }
}
function getEditPermissionsUrl(rdProfessionalApiUrl: string, userId: string): string {
    return `${rdProfessionalApiUrl}/refdata/external/v1/organisations/users/${userId}`
}
export default router
