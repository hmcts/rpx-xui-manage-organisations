import { generateToken } from '../../../../api/auth/serviceToken';
import {authenticateAndGetcookies} from './getCookie';
import { getauthToken } from './getToken';

const fetch = require('node-fetch');

const mainURL = process.env.TEST_URL || 'https://localhost:3000';
const LOG_REQUEST_ERROR_DETAILS = false;

export async function generateregPOSTAPIRequest(method, subURL, payload) {
  try {
    const cookie = await authenticateAndGetcookies(mainURL);

    // console.log(cookie)
    const options = {
      headers: {
        Cookie: `${cookie}`,
        'Content-Type': 'application/json'
      },
      json: true,
      resolveWithFullResponse: true,
      method,
      body: JSON.stringify(payload)
    };

    const url = `${mainURL}${subURL}`;

    console.log('url: ', url);
    console.log('method: ', method);
    console.log('options: ', options);

    // if (params.body) {
    //   options.body = params.body;
    // }

   // console.log('OPTIONS: ', method, mainURL + subURL, options);
    const response = await fetch(url, options);
    const data = await response.json();
    const headers = response.headers;
    return {
      headers,
      status: response.status,
      statusText: response.statusText,
      data
    };

  } catch (error) {
    console.log(error);
  }

 }

