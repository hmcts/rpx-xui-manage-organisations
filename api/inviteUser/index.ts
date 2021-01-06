import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import { getRefdataUserUrl } from '../refdataUserUrlUtil'

export const router = Router({ mergeParams: true })
const logger = log4jui.getLogger('invite-user')

router.post('/', inviteUserRoute)

export async function inviteUserRoute(req, res:Response)  {
    const payload = req.body

    try {
      const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)
      return await req.http.post(getRefdataUserUrl(rdProfessionalApiPath), payload)

      const response = await req.http.post(getRefdataUserUrl(rdProfessionalApiPath), payload)
      logger.info('response Stringify :', JSON.stringify(response.data));

      res.send(response.data)

    } catch (error) {
        logger.error('error', error)
        const errReport = {
            apiError: error.data.errorMessage,
            apiStatusCode: error.status,
            message: error.data.errorDescription,
        }
        res.status(error.status).send(errReport)
    }

}
export default router
