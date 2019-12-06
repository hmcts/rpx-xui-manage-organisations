import * as express from 'express'
import { config } from '../lib/config'
import { http } from '../lib/http'

async function handleAddressRoute(req, res) {
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
        const response = await http.get(
            `${config.services.feeAndPayApi}/pba-accounts/${req.params.account}/payments/`
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
