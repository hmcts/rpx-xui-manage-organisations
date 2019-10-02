import { generateToken } from '../../../../api/auth/serviceToken';
import { getOauth2Token } from './getToken';
import * as http from 'axios';


// const mainURL = process.env.TEST_URL || 'https://localhost:3000';
const mainURL = 'https://rd-professional-api-aat.service.core-compute-aat.internal'
const LOG_REQUEST_ERROR_DETAILS = false;

export async function generateAPIRequest(method, subURL, params) {

  let s2sToken;
  let authToken;

  try {
    s2sToken = await generateToken();
    authToken = await getOauth2Token();

    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ServiceAuthorization: s2sToken,
        'Content-Type': 'application/json'
      },
      json: true,
      resolveWithFullResponse: true
    };

    if (params.body) {
      options.body = params.body;
    }

    console.log('OPTIONS: ', method, mainURL + subURL, options);

    response = await http(method, mainURL + subURL, options);

    return response;

  } catch (error) {
    console.log(error);
  }

 }

