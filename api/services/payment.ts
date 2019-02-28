import config from '../lib/config'
import {http} from '../lib/http'

export async function getAccount(accountId: string): Promise<any> {
  const response = await http.get(`${config.services.payment_api}/accounts/${accountId}`)
  return response.data
}

export async function getPayments(accountId: string): Promise<any> {
  const response = await http.get(`${config.services.payment_api}/pba-accounts/${accountId}/payments`)
  return response.data
}
