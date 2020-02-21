const base64 = require('base-64')
const fetch = require('node-fetch');
const url = 'https://idam-api-idam-aat.service.core-compute-idam-aat.internal/oauth2/authorize'
const tokenUrl = 'https://idam-api-idam-aat.service.core-compute-idam-aat.internal'
const idamApi = 'https://idam-web-public.aat.platform.hmcts.net'
const idamSecret = process.env.IDAM_SECRET || 'AAAAAAAAAAAAAAAA'
const baseUrl = 'https://xui-mo-webapp-aat.service.core-compute-aat.internal'
const idamClient = 'xuimowebapp'

export async function getOauth2Token() {
  const redirectUri = `${baseUrl}/oauth2/callback`
  const urlPost = `${url}?response_type=code&client_id=${idamClient}&redirect_uri=${redirectUri}&scope=openid profile roles manage-user create-user`;

  // let encode = base64.encode((process.env.TEST_EMAIL + ':' + process.env.TEST_PASSWORD))
  const encode = base64.encode(('autotest_superuser@mailinator.com:Monday01'));

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


export async function getauthToken() {
  const codeValue = await getOauth2Token();
  const redirectUri = `${baseUrl}/oauth2/callback`;
  const tokenUrlPost = `${tokenUrl}/oauth2/token?code=${codeValue}&client_id=${idamClient}
  &redirect_uri=${redirectUri}&client_secret=${idamSecret}&grant_type=authorization_code`;

  // let encode = base64.encode((process.env.TEST_EMAIL + ':' + process.env.TEST_PASSWORD))
  // const encode = base64.encode(('lukexuisuperuser@mailnesia.com:Monday01'));

  const otherParam = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // Authorization: 'Bearer ' + encode

    },
    body: '',
    method: 'POST'
  };

  const response = await fetch(tokenUrlPost, otherParam);
  const accessToken = await response.json();
  console.log(accessToken.access_token)
  return accessToken.access_token;
}
