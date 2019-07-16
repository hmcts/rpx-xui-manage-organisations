const base64 = require('base-64')
const idam_api= 'https://idam-api.aat.platform.hmcts.net'
// const idam_api= 'https://idam-web-public.aat.platform.hmcts.net'
const idamSecret = process.env.IDAM_SECRET || 'AAAAAAAAAAAAAAAA'
const baseUrl= process.env.TEST_URL || 'https://localhost:3000'
const idamClient = 'xuiwebapp'
const fetch = require('node-fetch')

async function getOauth2Token () {
    const redirectUri = baseUrl+'/oauth2/callback'
    let token

    const hcode = await generateClientCode()

    let data =''
    // const url = 'http://localhost:4501/oauth2/token?code=' + hcode + '&client_id=' + idamClient + '&redirect_uri=' + redirectUri + '&client_secret=' + idamSecret+ '&grant_type=authorization_code'
    const url = idam_api+'/oauth2/token?code=' + hcode + '&client_id=' + idamClient + '&redirect_uri=' + redirectUri + '&client_secret=' + idamSecret+ '&grant_type=authorization_code'
  //const url = idam_api+'/oauth2/token?code=' + hcode + '&client_id=' + idamClient + '&redirect_uri=' + redirectUri
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
            console.log(res.access_token)
            return res.code
        })
        .catch(error => {
        })

    return token;
}



async function generateClientCode () {
  const redirectUri = baseUrl+'/oauth2/callback'
  const url = idam_api+'/oauth2/authorize?response_type=code&client_id=' + idamClient + '&redirect_uri=' + redirectUri
  const data = ''

  // let encode = base64.encode((process.env.TEST_EMAIL + ':' + process.env.TEST_PASSWORD))
  let encode = base64.encode(('sscs4jui@mailnesia.com'+ ':' + 'Monday01'))


    let code
    const otherParam = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
            ServiceAuthorization: 'Basic ' + encode

        },
        body: data,
        method: 'POST'
    }


  // This request successfully does a http request and returns data.
  // now let's place in the actual request.
    await fetch(url, otherParam)
      .then(data => data.json())
      .then(res => {
        console.log(JSON.stringify(res));
        code =res.code
        return res.code
      })
      .catch(error => {
      console.log(error)
    })
  return code

    // await fetch(url, otherParam)
    //   .then(data => data.json())
    //     .then(json =>  {
    //       console.log(JSON.stringify(res));
    //         code = res.code
    //         return res.code
    //     })
    //     .catch(error => {
    //         console.log(error)
    //     })

}

module.exports.getOauth2Token = getOauth2Token

