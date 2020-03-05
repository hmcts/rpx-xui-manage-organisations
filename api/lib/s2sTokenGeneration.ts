import * as otp from 'otp'
import {getConfigValue} from '../configuration'
import {
  MICROSERVICE,
  S2S_SECRET,
} from '../configuration/references'
import {http} from './http'
import * as log4jui from './log4jui'

const s2sSecret = getConfigValue(S2S_SECRET) // process.env.S2S_SECRET || 'S2S SECRET NEEDS TO BE SET'

const microservice = getConfigValue(MICROSERVICE) //application.microservice

const logger = log4jui.getLogger('s2s token generation')

const ERROR_GENERATING_S2S_TOKEN = 'Error generating S2S Token'
/**
 * Generate One Time Password
 *
 * With our S2S Secret we generate a one time password. This S2S secret is used to get our our S2S Token.
 *
 * @param s2sSecret
 * @returns {any}
 */
export function generateOneTimePassword(s2sSecret) {

  return otp({secret: s2sSecret}).totp()
}

/**
 * Return a generated S2S Token
 *
 * Note we do not rely on Idam to generate an S2S Token. Therefore it can be outside of any Idam authentication
 * layer.
 *
 * @microservice xui_webapp
 * @url https://rpe-service-auth-provider-aat.service.core-compute-aat.internal
 * @returns {string}
 */
export async function generateS2sToken(url) {

  const oneTimePassword = generateOneTimePassword(s2sSecret)
  logger.info('Generating the S2S token from secret  :', s2sSecret, microservice, oneTimePassword)

  try {

    const s2sTokenResponse = await requestS2sToken(url, microservice, oneTimePassword)
    const s2sToken = s2sTokenResponse.data
    return s2sToken
  } catch (error) {
    logger.error(`Error generating S2S Token`)
    logger.error(`Error generating S2S Token: Status code ${error.status}`)
    logger.error(`Error generating S2S Token: path to token generation ${url}`)
    logger.error(`Error generating S2S Token: S2S secret ${s2sSecret}`)
    logger.error(`Error generating S2S Token: microservice ${microservice}`)

    // TODO: This only passes up strings, in the future it should pass up
    // the object
    throw new Error(ERROR_GENERATING_S2S_TOKEN)
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
