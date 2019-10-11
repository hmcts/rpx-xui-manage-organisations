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
    const accountNames = req.query.accountNames.split(',')
    console.log('accountNames', accountNames)
    const accounts = new Array()
    for (const accountName of accountNames) {
        const url = `${config.services.feeAndPayApi}/accounts/${accountName}`
        try {
            const account = await getAccount(url)
            accounts.push(account)
        } catch (error) {
            console.error(error)
            errReport = {
                apiError: error && error.data && error.data.message ? error.data.message : error,
                apiStatusCode: error && error.status ? error.status : '',
                message: `Fee And Pay route error  with url - ${url}`,
            }
            res.status(500).send(errReport)
            return
        }
    }
    res.send(accounts)
}

async function getAccount(url: string) {
    const response = await http.get(url)
    console.log('response.data', response.data)
    return response.data
}

export const router = express.Router({ mergeParams: true })

router.get('', handleAddressRoute)

export default router
