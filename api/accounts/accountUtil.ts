import {Request} from 'express';
import { FeeAccount } from '../interfaces/feeAccountPayload';
import {valueOrNull} from "../lib/util";

export function getAccountUrl(baseUrl: string, accountName: string) {
    return `${baseUrl}/accounts/${accountName}`;
}

export function getAccount(accountNumber: string, url: string, req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
        req.http.get(url)
        .then(account => {
            resolve(account);
        })
        .catch(err => {
            valueOrNull(err, 'status') === 404 ? resolve({data: getMissingFeeAccount(accountNumber), status: 404}) : reject(err);
        });
    });
}

export function getMissingFeeAccount(accountNumber: string): FeeAccount {
    return {
        account_name: null,
        account_number: accountNumber,
        available_balance: 0,
        credit_limit: null,
        effective_date: new Date(),
        status: null,
    };
}
