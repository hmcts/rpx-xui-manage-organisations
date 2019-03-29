import config from '../lib/config'
import {http} from '../lib/http'
import {PaymentAccountDto, Payments} from '../lib/models/transactions'

export async function getAccount(accountId: string): Promise<PaymentAccountDto[]> {
  const response = await http.get(`${config.services.payment_api}/accounts/${accountId}`)
  return response.data
}

export async function getPayments(accountId: string): Promise<Payments> {
  const response = await http.get(`${config.services.payment_api}/pba-accounts/${accountId}/payments`)
  return response.data
}
