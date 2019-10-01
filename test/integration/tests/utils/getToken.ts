// import {config} from "../../../../api/lib/config";
import axios, { AxiosResponse } from 'axios'
const base64 = require('base-64')
const FormData = require('form-data')
const fetch = require('node-fetch');
const url = 'https://idam-api-idam-aat.service.core-compute-idam-aat.internal/oauth2/authorize'
const idam_api= 'https://idam-web-public.aat.platform.hmcts.net'
const idamSecret = process.env.IDAM_SECRET || 'AAAAAAAAAAAAAAAA'
const baseUrl = 'https://xui-mo-webapp-aat.service.core-compute-aat.internal'
const idamClient = 'xuimowebapp'
// const code = ''

async function generateClientCode() {
  // const redirectUri = baseUrl + '/oauth2/callback'
  const redirectUri = 'https://xui-mo-webapp-aat.service.core-compute-aat.internal/oauth2/callback'

  // Build formData object.
  const formData = new FormData();
  formData.append('response_type', 'code');
  formData.append('client_id', idamClient);
  formData.append('redirect_uri', redirectUri);
  formData.append('scope', 'profile openid roles manage-user create-user manage-roles');


  // let encode = base64.encode((process.env.TEST_EMAIL + ':' + process.env.TEST_PASSWORD))
  const encode = base64.encode(('lukexuisuperuser@mailnesia.com'+ ':' + 'Monday01'))

  console.log(encode)
  console.log(url)

  try {
    return await fetch(url, {
      method: 'POST',
      headers: {
        authorization: 'Basic ' + encode,
        'Content-Type': 'application/x-www-form-urlencoded'

      },
       // body: JSON.stringify({formData})
      body: JSON.stringify({
        response_type: 'code',
        client_id: 'xuimowebapp',
        redirect_uri: 'https://xui-mo-webapp-aat.service.core-compute-aat.internal/oauth2/callback',
        scope: 'profile openid roles manage-user create-user manage-roles',
      })
    });
  } catch (error) {
    console.log('Request failure: ', error);
  }

  // await fetch(url, otherParam).then(data => data.json())
  //   .then(res => {
  //     code = res.code
  //     return res.code
  //   })
  //   .catch(error => {
  //     console.log(error)
  //   })
  // return code
}

export async function getOauth2Token() {
    const hcode = await generateClientCode()
    console.log(hcode);
  //   let data =''
  //   // const url = 'http://localhost:4501/oauth2/token?code=' + hcode + '&client_id=' + idamClient + '&redirect_uri=' + redirectUri + '&client_secret=' + idamSecret+ '&grant_type=authorization_code'
  //   const url = idam_api+'/oauth2/authorize?grant_type=authorization_code&code=' + hcode + '&redirect_uri=' + redirectUri
  // //const url = idam_api+'/oauth2/token?code=' + hcode + '&client_id=' + idamClient + '&redirect_uri=' + redirectUri
  //   const otherParam = {
  //       headers: {
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: data,
  //       method: 'POST'
  //   }
  //
  //   await fetch(url, otherParam).then(data => data.json())
  //       .then(res => {
  //           token = res.access_token
  //           console.log(res.access_token)
  //           return res.code
  //       })
  //       .catch(error => {
  //       })
  //
  //   return token;
}

module.exports.getOauth2Token = getOauth2Token

