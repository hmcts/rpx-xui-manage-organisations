import {Request} from 'express'
import { FeeAccount } from '../interfaces/feeAccountPayload'

export function getAccountUrl(baseUrl: string, accountName: string) {
    return `${baseUrl}/accounts/${accountName}`
}

export function getAccount(accountNumber: string, url: string, req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
        req.http.get(url)
        .then(account => {
            resolve(account)
        })
        .catch(err => {
            err && err.status && err.status === 404 ? resolve({data: getMissingFeeAccount(accountNumber), status: 404}) : reject(err)
        })
    })
}

export function getMissingFeeAccount(accountNumber: string): FeeAccount {
    return {
        account_number: accountNumber,
        account_name: null,
        credit_limit: null,
        available_balance: 0,
        status: null,
        effective_date: new Date(),
    }
}
