import * as express from 'express'
import {getConfigValue} from '../configuration'
import {SERVICES_FEE_AND_PAY_API_PATH} from '../configuration/references'
import {exists, valueOrNull} from '../lib/util'

async function handleAddressRoute(req: express.Request, res: express.Response) {
  let errReport: any
  if (!req.params.account) {
    errReport = {
      apiError: 'Account is missing',
      apiStatusCode: '400',
      message: 'Fee And Pay route error',
    }
    res.status(errReport.apiStatusCode).send(errReport)
  }
  try {
    const response = await req.http.get(
      `${getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)}/pba-accounts/${req.params.account}/payments/`
    )
    res.send(response.data.payments)
  } catch (error) {
    const status = exists(error, 'status') ? error.status : 500
    errReport = {
      apiError: valueOrNull(error, 'data.message'),
      apiStatusCode: status,
      message: 'Fee And Pay route error',
    }
    res.status(status).send(errReport)
  }
}

export const router = express.Router({mergeParams: true})

router.get('', handleAddressRoute)

export default router
