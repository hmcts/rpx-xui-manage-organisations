import * as express from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_FEE_AND_PAY_API_PATH } from '../configuration/references'

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
        errReport = {
            apiError: error.data.message,
            apiStatusCode: error.status,
            message: 'Fee And Pay route error',
        }
        res.status(errReport.apiStatusCode).send(errReport)
    }
}

export const router = express.Router({ mergeParams: true })

router.get('', handleAddressRoute)

export default router
