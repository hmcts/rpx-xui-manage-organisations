import { getConfigValue } from '../configuration'
import { SERVICES_FEE_AND_PAY_API_PATH } from '../configuration/references'
import { http } from '../lib/http'
import { PaymentAccountDto, Payments } from '../lib/models/transactions'

export async function getAccount(accountId: string): Promise<PaymentAccountDto[]> {
    const response = await http.get(`${getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)}/accounts/${accountId}`)
    return response.data
}

export async function getPayments(accountId: string): Promise<Payments> {
    const response = await http.get(`${getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)}/pba-accounts/${accountId}/payments`)
    return response.data
}
