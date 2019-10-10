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
    let accountNames = req.query.accountNames.split(',')
    console.log('accountNames', accountNames)
    const accounts = new Array()
    for (const accountName of accountNames) {
        try {
            const account = await getAccount(accountName)
            accounts.push(account)
        } catch (error) {
            console.error(error)
            errReport = {
                apiError: error.data.message,
                apiStatusCode: error.status,
                message: 'Fee And Pay route error',
            }
            res.status(500).send(errReport)
            return
        }
    }
    res.send(accounts)
}

async function getAccount(account: any) {
    const response = await http.get(
    `${config.services.feeAndPayApi}/accounts/${account}`)
    console.log('response.data', response.data)
    return response.data
}

export const router = express.Router({ mergeParams: true })

router.get('', handleAddressRoute)

export default router
