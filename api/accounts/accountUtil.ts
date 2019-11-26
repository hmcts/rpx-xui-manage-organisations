import { FeeAccount } from "../../src/fee-accounts/models/pba-accounts"
import { http } from '../lib/http'

export function getAccountUrl(baseUrl: string, accountName: string) {
    return `${baseUrl}/accounts/${accountName}`
}

export function getAccount(accountNumber: string, url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        http.get(url)
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
        account_name: '',
        credit_limit: 0,
        available_balance: 0,
        status: '',
        effective_date: new Date(2017, 1, 1),
    }
}
