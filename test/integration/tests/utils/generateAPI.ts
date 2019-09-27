import { generateToken } from '../../../../api/auth/serviceToken';
import { getTokenFromCode } from '../../../../api/auth/index';
// import * as http from 'http';
import { http } from '../../../../api/lib/http';


// const should = require('should');
// const http = require('axios');
// const getCookie = require('./getToken');

// const mainURL = process.env.TEST_URL || 'https://localhost:3000';
const mainURL = 'https://rd-professional-api-aat.service.core-compute-aat.internal'
const LOG_REQUEST_ERROR_DETAILS = false;


// const s2sToken = generateToken()

export async function generateAPIRequest(method, subURL, params) {

    // await getCookie.getOauth2Token().then(function (token) {
    //     cookie = token;
    // });

  let s2sToken;
  let token;

  try {
    s2sToken = await generateToken();
    token = await getCookie.getOauth2Token();
  } catch (error) {
    console.log(error);
  }

  return s2sToken;
// console.log('cookie Value :' + cookie)
    /*const options = {
        headers: {
            // Cookie: '__auth__=' + cookie,
            Authorization: `Bearer ${authToken}`,
            ServiceAuthorization: s2sToken,
            'Content-Type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    };
    console.log(options);*/
//     if (params.body) options.body = params.body;
//
//     let response
//
//   console.log(mainURL + subURL)
//
//     try {
//         response = await http(method, mainURL + subURL, options);
//     } catch (e) {
//         if (LOG_REQUEST_ERROR_DETAILS) {
//             console.log(Error.response.body, 'ERROR !');
//         }
//     }
//     if (LOG_REQUEST_ERROR_DETAILS) {
//         requestPromise.catch(error => console.log(error.response.body, 'ERROR !'));
//     }
//     return response;
 }

