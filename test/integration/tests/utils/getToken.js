//const config = require('../../../../config')
const config = require('../../../../dist/jui-backend/config')
const base64 = require('base-64')
const idam_api= 'https://preprod-idamapi.reform.hmcts.net:3511'
const idamSecret = process.env.IDAM_SECRET || 'AAAAAAAAAAAAAAAA'
const baseUrl= process.env.TEST_URL || 'https://localhost:3000'
const idamClient = config.idam_client
const fetch = require('node-fetch')

async function getOauth2Token () {
    const redirectUri = baseUrl+'/oauth2/callback'
    let token

    const hcode = await generateClientCode()

    let data
    // const url = 'http://localhost:4501/oauth2/token?code=' + hcode + '&client_id=' + idamClient + '&redirect_uri=' + redirectUri + '&client_secret=' + idamSecret+ '&grant_type=authorization_code'
    const url = idam_api+'/oauth2/token?code=' + hcode + '&client_id=' + idamClient + '&redirect_uri=' + redirectUri + '&client_secret=' + idamSecret+ '&grant_type=authorization_code'
    const otherParam = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
        method: 'POST'
    }

    await fetch(url, otherParam).then(data => data.json())
        .then(res => {
            token = res.access_token
            //console.log(res.access_token)
            return res.code
        })
        .catch(error => {
        })

    return token;
}

async function generateClientCode () {
    const redirectUri = baseUrl+'/oauth2/callback'
    // const url = 'http://localhost:4501/oauth2/authorize?response_type=code&client_id=' + idamClient + '&redirect_uri=' + redirectUri
    const url = idam_api+'/oauth2/authorize?response_type=code&client_id=' + idamClient + '&redirect_uri=' + redirectUri
    const data = ''

    // let encode = base64.encode(('XXX' + ':' + 'XXX')) //local purpose
    let encode = base64.encode((process.env.TEST_EMAIL + ':' + process.env.TEST_PASSWORD))

    let code
    const otherParam = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ServiceAuthorization: 'Bearer ' + encode

        },
        body: data,
        method: 'POST'
    }

    await fetch(url, otherParam).then(data => data.json())
        .then(res => {
            code = res.code
            return res.code
        })
        .catch(error => {
            console.log(error)
        })
    return code
}

module.exports.getOauth2Token = getOauth2Token

