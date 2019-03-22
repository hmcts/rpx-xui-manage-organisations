import config from '../lib/config'
import {http} from '../lib/http'
import {PaymentAccountDto} from '../lib/models/transactions';

export async function getOrganisationId(details) {
  // TODO remove the hardcoded email when correct user gets returned from idam
  // const email = details.data.email;
  const email = 'henry_fr_harper@yahoo.com'
  return await http.get(`${config.services.rdProfessionalApi}/search/organisations/${email}`)
}

export async function getAccountsForOrganisation(orgId: string): Promise<PaymentAccountDto[]> {
  const response = await http.get(`${config.services.rdProfessionalApi}/organisations/${orgId}/pbas`)
  return response.data
}
