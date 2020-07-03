import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import { ErrorReport } from '../interfaces/errorReport'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'

export const router = Router({ mergeParams: true })
const logger = log4jui.getLogger('outgoing')

router.put('', inviteUserRoute)

async function inviteUserRoute(req: Request, res: Response) {
    let errReport: ErrorReport
    if (!req.params.userId) {
        errReport = getErrorReport('UserId is missing', '400', 'User Permissions route error')
        res.status(400).send(errReport)
        return
    }
    const payload = req.body
    try {
      const response = await req.http.put(getEditPermissionsUrl(getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH), req.params.userId), payload)
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
function getErrorReport(apiError: string, apiStatusCode: string, message: string): ErrorReport {
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
