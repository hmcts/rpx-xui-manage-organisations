import {getConfigValue} from '../../../../api/configuration';
import {IDAM_CLIENT} from '../../../../api/configuration/references';

const base64 = require('base-64')
const fetch = require('node-fetch');
const url = 'https://idam-api.aat.platform.hmcts.net/oauth2/authorize'
const tokenUrl = 'https://idam-api.aat.platform.hmcts.net'
const idamApi = 'https://idam-api.aat.platform.hmcts.net'
const idamSecret = process.env.IDAM_SECRET || 'AAAAAAAAAAAAAAAA'
const baseUrl = 'https://manage-org.aat.platform.hmcts.net'
const idamClient = 'xuimowebapp';

export async function getOauth2Token() {
  const redirectUri = `${baseUrl}/oauth2/callback`
  const urlPost = `${url}?response_type=code&client_id=${idamClient}&redirect_uri=${redirectUri}&scope=openid profile roles manage-user create-user`;

  // let encode = base64.encode((process.env.TEST_EMAIL + ':' + process.env.TEST_PASSWORD))
  // const encode = base64.encode(('autotest_superuser@mailinator.com:Monday01'));
  const encode = base64.encode(('xuiapitestuser@mailnesia.com:Monday01'));
  console.log (`THIS IS MY FIRST TEST:${encode}`)
  const otherParam = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${encode}`

    },
    body: '',
    method: 'POST'
  };
  console.log (`THIS IS MY url post:${urlPost}`)
  const response = await fetch(urlPost, otherParam);
  const code = await response.json();
  return code.code;
}


export async function getauthToken() {
  const codeValue = await getOauth2Token();
  const redirectUri = `${baseUrl}/oauth2/callback`;
  // const tokenUrlPost = `${tokenUrl}/oauth2/token?code=${codeValue}&client_id=${idamClient}
  // &redirect_uri=${redirectUri}&client_secret=${idamSecret}&grant_type=authorization_code`;
  const tokenUrlPost = `${tokenUrl}/oauth2/token?grant_type=authorization_code&code=${codeValue}
  &redirect_uri=${redirectUri}`;

  console.log(tokenUrlPost)

  // let encode = base64.encode((process.env.TEST_EMAIL + ':' + process.env.TEST_PASSWORD))
  const encode = base64.encode(('xuiapitestuser@mailnesia.com:Monday01'));

  const otherParam = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
       Authorization: `Basic ${Buffer.from(`${getConfigValue(IDAM_CLIENT)}:${idamSecret}`).toString('base64')}`

    },
    body: '',
    method: 'POST'
  };

  const response = await fetch(tokenUrlPost, otherParam);
  const accessToken = await response.json();
  // console.log(accessToken)
  console.log(accessToken.access_token)
  return accessToken.access_token;
}

// await fetch(url, otherParam).then(data => data.json())
//   .then(res => {
//     token = res.access_token
//     //console.log(res.access_token)
//     return res.code
//   })
//   .catch(error => {
//   })
