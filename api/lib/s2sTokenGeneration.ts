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
 * generateOneTimePassword
 *
 * With our S2S Secret we generate a one time password, that is used to get our our S2S Token.
 *
 * @param s2sSecret
 * @returns {any}
 */
export function generateOneTimePassword(s2sSecret) {

  return otp({secret: s2sSecret}).totp()
}

/**
 * Return the generated S2S token
 *
 * Note we do not rely on Idam to generate an S2S Token. Therefore it can be outside of any Idam authentication
 * layer.
 *
 * @microservice xui_webapp
 * @url https://rpe-service-auth-provider-aat.service.core-compute-aat.internal
 * @returns {string}
 */
export async function generateS2sToken() {

  const oneTimePassword = generateOneTimePassword(s2sSecret)
  logger.info('Generating the S2S token from secret  :', s2sSecret, microservice, oneTimePassword)

  try {

    const s2sTokenResponse = await requestS2sToken(url, microservice, oneTimePassword)
    const s2sToken = s2sTokenResponse.data
    console.log('s2sToken')
    console.log(s2sToken)
    return s2sToken
  } catch (error) {
    console.log('error')
    console.log(error)
  }
}

/**
 * Request S2S Token
 *
 * @param url - ie. https://rpe-service-auth-provider-aat.service.core-compute-aat.internal
 * @param microservice - xui_webapp
 * @param oneTimePassword - Generated with a one time password generator
 *
 * @returns {Promise<AxiosPromise<any>>}
 */
export async function requestS2sToken(url, microservice, oneTimePassword) {

  return http.post(`${url}/lease`, {
    microservice,
    oneTimePassword,
  })
}
