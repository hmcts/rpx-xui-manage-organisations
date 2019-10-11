import { AxiosPromise } from 'axios'
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
    const accountPromises = new Array<AxiosPromise<any>>()
    accountNames.forEach((accountName: string) => accountPromises.push(getAccount(accountName)))

    try {
        await Promise.all(accountPromises).then(allAccounts => {
            allAccounts.forEach(account => {
                accounts.push(account.data)
            })
        })
        } catch (error) {
            console.error(error)
            errReport = {
                apiError: error && error.data && error.data.message ? error.data.message : error,
                apiStatusCode: error && error.status ? error.status : '',
                message: `Fee And Pay route error `,
            }
            res.status(500).send(errReport)
            return
        }
    res.send(accounts)
}

function getAccount(accountName: string): AxiosPromise<any> {
    const url = `${config.services.feeAndPayApi}/accounts/${accountName}`
    const promise = http.get(url)
    return promise
    }

export const router = express.Router({ mergeParams: true })

router.get('', handleAddressRoute)

export default router
