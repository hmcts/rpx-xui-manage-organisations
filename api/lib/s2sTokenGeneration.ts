import * as otp from 'otp'
import * as log4jui from '../lib/log4jui'
import {application} from '../lib/config/application.config'
import {config} from '../lib/config';
import {http} from '../lib/http'

const s2sSecret = process.env.S2S_SECRET || 'AAAAAAAAAAAAAAAA'

const microservice = application.microservice
const url = config.services.s2s

const logger = log4jui.getLogger('service user-profile')

/**
 * Return the generated S2s token
 *
 * @returns {string}
 */
export async function generateS2sToken() {
  console.log('s2sSecret')
  console.log(s2sSecret)
  console.log('microservice')
  console.log(microservice)
  console.log('url')
  console.log(url)

  const oneTimePassword = otp({secret: s2sSecret}).totp()

  logger.info('generating from secret  :', s2sSecret, microservice, oneTimePassword)

  try {
    const response = await http.post(`${url}/lease`, {
      microservice,
      oneTimePassword,
    })
    console.log('response')
    console.log(response)
    return 'hello s2s token'
  } catch (error) {
    console.log('error')
    console.log(error)
  }
}
