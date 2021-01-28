import { Request, Response, Router } from 'express'
import {getConfigValue} from '../configuration'
import {SERVICES_RD_PROFESSIONAL_API_PATH} from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import { getRefdataUserUrl } from '../refdataUserUrlUtil'
import {exists, valueOrNull} from '../lib/util'

export const router = Router({mergeParams: true})
const logger = log4jui.getLogger('suspend-user')

router.put('/', suspendUser)

export async function suspendUser(req: Request, res: Response) {
  const payload = req.body
  try {
        const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)
    const response = await req.http.put(`${getRefdataUserUrl(rdProfessionalApiPath)}${req.params.userId}`, payload)
    logger.info('response::', response.data)
    res.send(response.data)
  } catch (error) {
    logger.error('error', error)
    const status = exists(error, 'status') ? error.status : 500
    const msg = valueOrNull(error, 'data.message')
    const errReport = {
      apiError: msg,
      apiStatusCode: status,
      message: msg,
    }
    res.status(status).send(errReport)
  }
}

export default router
