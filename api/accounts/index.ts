import * as express from 'express'
import { config } from '../lib/config'
import { http } from '../lib/http'

async function handleAddressRoute(req, res) {
    let errReport: any
    if (!req.query.accountNames) {
        errReport = {
            apiError: 'Account is missing',
            apiStatusCode: '400',
            message: 'Fee And Pay route error',
        }
        res.status(500).send(errReport)
    }
    console.log('accountNames' + req.query.accountNames)
    try {
        const response = await http.get(
          `${config.services.feeAndPayApi}/accounts/PBA0082848`
        )
        const accounts = new Array<any>()
        accounts.push(response.data)
        res.send(accounts)
    } catch (error) {
        console.error(error)
        errReport = {
            apiError: error.data.message,
            apiStatusCode: error.status,
            message: 'Fee And Pay route error',
        }
        res.status(500).send(errReport)
    }
}

export const router = express.Router({ mergeParams: true })

router.get('', handleAddressRoute)

export default router
