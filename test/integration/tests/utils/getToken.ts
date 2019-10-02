// import {config} from "../../../../api/lib/config";
const base64 = require('base-64')
const fetch = require('node-fetch');
const url = 'https://idam-api-idam-aat.service.core-compute-idam-aat.internal/oauth2/authorize'
const idamApi = 'https://idam-web-public.aat.platform.hmcts.net'
const idamSecret = process.env.IDAM_SECRET || 'AAAAAAAAAAAAAAAA'
const baseUrl = 'https://xui-mo-webapp-aat.service.core-compute-aat.internal'
const idamClient = 'xuimowebapp'

export async function getOauth2Token() {
  const redirectUri = `${baseUrl}/oauth2/callback`
  const urlPost = `${url}?response_type=code&client_id=${idamClient}&redirect_uri=${redirectUri}`;

  // let encode = base64.encode((process.env.TEST_EMAIL + ':' + process.env.TEST_PASSWORD))
  const encode = base64.encode(('lukexuisuperuser@mailnesia.com:Monday01'));

  const otherParam = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + encode

    },
    body: '',
    method: 'POST'
  };

  const response = await fetch(urlPost, otherParam);
  const code = await response.json();
  return code.code;
}
