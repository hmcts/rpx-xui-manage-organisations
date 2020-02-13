import { AxiosPromise } from 'axios'
import * as express from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_FEE_AND_PAY_API_PATH } from '../configuration/references'
import { FeeAccount } from '../interfaces/feeAccountPayload'
import { http } from '../lib/http'
import { getAccountUrl } from './accountUtil'

async function handleAddressRoute(req, res) {
    let errReport: any
    if (!req.query.accountNames) {
        errReport = {
            apiError: 'Account is missing',
            apiStatusCode: 400,
            message: 'Fee And Pay route error',
        }
        res.status(errReport.apiStatusCode).send(errReport)
    }
    const accountNames = req.query.accountNames.split(',')
    const accounts = new Array<FeeAccount>()
    const accountPromises = new Array<AxiosPromise<any>>()

    accountNames.forEach((accountNumber: string) => {
        const feeAndPayHostUrl = getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)
        const url = getAccountUrl(feeAndPayHostUrl, accountNumber)
        accountPromises.push(getAccountPromise(url))
    })
    let responseStatusCode
    try {
            await Promise.all(accountPromises).then(allAccounts => {
                allAccounts.forEach(account => {
                    if (account.status === 404) {
                        responseStatusCode = 404
                    }
                    accounts.push(account.data)
                })
            })
        } catch (error) {
            errReport = {
                apiError: error && error.data && error.data.message ? error.data.message : error,
                apiStatusCode: error && error.status ? error.status : '',
                message: `Fee And Pay route error `,
            }
            res.status(error.status).send(errReport)
            return
        }
    if (responseStatusCode) {
        res.status(responseStatusCode).send(accounts)
    } else {
        res.send(accounts)
    }
}

function getAccountPromise(url: string): AxiosPromise<any> {
    const promise = http.get(url).catch(err => err)
    return promise
}

export const router = express.Router({ mergeParams: true })
router.get('', handleAddressRoute)
export default router
