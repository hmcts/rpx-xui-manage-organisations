import {
  EnvironmentConfigCookies,
  EnvironmentConfigExceptionOptions,
  EnvironmentConfigServices
} from '../interfaces/environment.config'
import {healthEndpoints} from './health'
import {getConfigValue, getEnvironment, showFeature} from './index'
import {
  COOKIE_TOKEN,
  COOKIES_USERID,
  FEATURE_SECURE_COOKIE_ENABLED,
  IDAM_CLIENT,
  INDEX_URL,
  LOGGING,
  MAX_LINES,
  MAX_LOG_LINE,
  MICROSERVICE,
  NOW,
  OAUTH_CALLBACK_URL,
  PROTOCOL,
  SERVICE_S2S_PATH,
  SERVICES_FEE_AND_PAY_API_PATH,
  SERVICES_IDAM_API_PATH,
  SERVICES_IDAM_WEB,
  SERVICES_RD_PROFESSIONAL_API_PATH,
  SERVICES_TERMS_AND_CONDITIONS_API_PATH,
  SESSION_SECRET
} from './references'

export const uiConfig = () => {

  const configEnv = getEnvironment()

  return {
    configEnv,
    cookies: {
      token: getConfigValue(COOKIE_TOKEN),
      userId: getConfigValue(COOKIES_USERID),
    } as EnvironmentConfigCookies,
    exceptionOptions: {
      maxLines: getConfigValue(MAX_LINES),
    } as EnvironmentConfigExceptionOptions,
    health: healthEndpoints() as EnvironmentConfigServices,
    idamClient: getConfigValue(IDAM_CLIENT),
    indexUrl: getConfigValue(INDEX_URL),
    logging: getConfigValue(LOGGING),
    maxLogLine: getConfigValue(MAX_LOG_LINE),
    microservice: getConfigValue(MICROSERVICE),
    now: getConfigValue(NOW),
    oauthCallbackUrl: getConfigValue(OAUTH_CALLBACK_URL),
    protocol: getConfigValue(PROTOCOL),
    secureCookie: showFeature(FEATURE_SECURE_COOKIE_ENABLED),
    services: {
      feeAndPayApi: getConfigValue(SERVICES_FEE_AND_PAY_API_PATH),
      idamApi: getConfigValue(SERVICES_IDAM_API_PATH),
      idamWeb: getConfigValue(SERVICES_IDAM_WEB),
      rdProfessionalApi: getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH),
      s2s: getConfigValue(SERVICE_S2S_PATH),
      termsAndConditions: getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH),
    } as EnvironmentConfigServices,
    sessionSecret: getConfigValue(SESSION_SECRET),
  }
}
