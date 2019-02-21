import config from '../lib/config';
import {http} from '../lib/http';

export async function getOrganisationId(jwt, details) {
  const email = details.data.email;
  return await http.get(`${config.services.rd_professional_api}/search/organisations/${email}`)
}

