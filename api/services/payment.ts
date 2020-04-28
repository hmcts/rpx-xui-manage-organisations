import { Request } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_FEE_AND_PAY_API_PATH } from '../configuration/references'
import { PaymentAccountDto, Payments } from '../lib/models/transactions'

export async function getAccount(accountId: string, req: Request): Promise<PaymentAccountDto[]> {
    const response = await req.http.get(`${getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)}/accounts/${accountId}`)
    return response.data
}

export async function getPayments(accountId: string, req: Request): Promise<Payments> {
    const response = await req.http.get(`${getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)}/pba-accounts/${accountId}/payments`)
    return response.data
}
