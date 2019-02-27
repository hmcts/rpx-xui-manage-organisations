import config from '../lib/config'
import {http} from '../lib/http'

export async function getOrganisationId(details) {
  // TODO remove the hardcoded email when correct user gets returned from idam
  // const email = details.data.email;
  const email = 'juitestuser2@gmail.com'
  return await http.get(`${config.services.rd_professional_api}/search/organisations/${email}`)
}

export async function getAccountsForOrganisation(orgId: string): Promise<any> {
  const response = await http.get(`${config.services.rdProfessionalApi}/organisations/${orgId}/pbas`)
  return response.data
}
