import * as express from 'express'
import {getConfigValue} from '../configuration'
import {SERVICES_RD_PROFESSIONAL_API_PATH} from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import {exists, valueOrNull} from '../lib/util'

export const router = express.Router({mergeParams: true})
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
