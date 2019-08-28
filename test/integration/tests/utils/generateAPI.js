import {config} from "../../../../api/lib/config";
import {AxiosResponse} from "axios/index";

const should = require('should');
const http = require('axios');
const getCookie = require('./getToken');
let cookie;
const mainURL = process.env.TEST_URL || 'https://localhost:3000';
const LOG_REQUEST_ERROR_DETAILS = false;

// let browser_cookie= ''
async function generateAPIRequest(method, subURL, params) {

    await getCookie.getOauth2Token().then(function (token) {
        cookie = token;
    });

async function getTokenFromCode(req: express.Request, res: express.Response): Promise<AxiosResponse> {
    console.log(`${config.idamClient}:${secret}`)
    const Authorization = `Basic ${new Buffer(`${config.idamClient}:${secret}`).toString('base64')}`
    const options = {
      headers: {
        Authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    logger.info('Getting Token from auth code.')

    console.log(
      `${config.services.idamApi}/oauth2/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${
        config.protocol
        }://${req.headers.host}${config.oauthCallbackUrl}`
    )
    return http.post(
      `${config.services.idamApi}/oauth2/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${
        config.protocol
        }://${req.headers.host}${config.oauthCallbackUrl}`,
      {},
      options
    )
  }





console.log('cookie Value :' + cookie)
    const options = {
        headers: {
            Cookie: '__auth__=' + cookie,
            'Content-Type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    };

    if (params.body) options.body = params.body;

    let response
console.log(mainURL + subURL)
    try {
        response = await http(method, mainURL + subURL, options)
    } catch (e) {
        if (LOG_REQUEST_ERROR_DETAILS) {
            console.log(error.response.body, 'ERROR !');
        }
    }
    if (LOG_REQUEST_ERROR_DETAILS) {
        requestPromise.catch(error => console.log(error.response.body, 'ERROR !'));
    }
    return response;
}

module.exports.generateAPIRequest = generateAPIRequest;
