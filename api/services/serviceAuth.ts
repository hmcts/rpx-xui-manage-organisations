import { AxiosResponse } from 'axios'
import { Request, Router } from 'express'
import * as otp from 'otp'
import { getConfigValue, showFeature } from '../configuration'
import {
  APP_INSIGHTS_KEY,
  COOKIE_TOKEN,
  COOKIES_USERID,
  FEATURE_APP_INSIGHTS_ENABLED,
  FEATURE_PROXY_ENABLED,
  FEATURE_REDIS_ENABLED,
  FEATURE_SECURE_COOKIE_ENABLED,
  FEATURE_TERMS_AND_CONDITIONS_ENABLED,
  IDAM_CLIENT,
  JURISDICTIONS,
  MAX_LINES,
  MAX_LOG_LINE,
  MICROSERVICE,
  NOW,
  OAUTH_CALLBACK_URL,
  PROTOCOL,
  REDIS_KEY_PREFIX,
  REDIS_TTL,
  REDISCLOUD_URL,
  S2S_SECRET,
  SERVICE_S2S_PATH,
  SERVICES_FEE_AND_PAY_API_PATH,
  SERVICES_IDAM_API_PATH,
  SERVICES_IDAM_WEB,
  SERVICES_RD_PROFESSIONAL_API_PATH,
  SERVICES_TERMS_AND_CONDITIONS_API_PATH,
  SESSION_SECRET
} from '../configuration/references'
import { application } from '../lib/config/application.config'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'
import * as tunnel from '../lib/tunnel'

export async function postS2SLease() {
  const s2sSecret = getConfigValue(S2S_SECRET) || 'AAAAAAAAAAAAAAAA'
  const url = getConfigValue(SERVICE_S2S_PATH)
  const microservice =  application.microservice
  const logger = log4jui.getLogger('service user-profile')
  let request: AxiosResponse<any>
  const axiosInstance = http({
    session: {
      auth: {
        token: '',
      },
    },
  } as unknown as Request)
  console.log('NODE_CONFIG_ENV is now:', process.env.NODE_CONFIG_ENV)
  console.log('postS2SLease url:', url)
  if (process.env.NODE_CONFIG_ENV !== 'ldocker') {
        const oneTimePassword = otp({ secret: s2sSecret }).totp()
        logger.info('Generating S2S token for microservice: ', microservice)
        request = await axiosInstance.post(`${url}/lease`, {
          microservice,
          oneTimePassword,
        })
    } else {
        // this is only for local development against the RD docker image
        // end tunnel before posting to docker
        tunnel.end()
        request = await axiosInstance.get(`${url}`)
    }
  return request.data
}

export const router = Router({ mergeParams: true })

router.get('/health', (req, res, next) => {
    res.status(200).send({
      allowConfigMutations: process.env.ALLOW_CONFIG_MUTATIONS,
      nodeConfigEnv: process.env.NODE_CONFIG_ENV,
      // 1st set
      // tslint:disable-next-line:object-literal-sort-keys
      idamClient: getConfigValue(IDAM_CLIENT),
      maxLogLine: getConfigValue(MAX_LOG_LINE),
      microService: getConfigValue(MICROSERVICE),
      maxLines: getConfigValue(MAX_LINES),
      now: getConfigValue(NOW),
      // 2nd set
      cookieToken: getConfigValue(COOKIE_TOKEN),
      cookieUserId: getConfigValue(COOKIES_USERID),
      oauthCallBack: getConfigValue(OAUTH_CALLBACK_URL),
      protocol: getConfigValue(PROTOCOL),
      // 3rd set
      idamApiPath: getConfigValue(SERVICES_IDAM_API_PATH),
      idamWeb: getConfigValue(SERVICES_IDAM_WEB),
      s2sPath: getConfigValue(SERVICE_S2S_PATH),
      rdProfessionalApi: getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH),
      feeAndPayApi: getConfigValue(SERVICES_FEE_AND_PAY_API_PATH),
      termsAndConditionsApi: getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH),
      // 4th set
      sessionSecret: getConfigValue(SESSION_SECRET),
      jurisdictions: getConfigValue(JURISDICTIONS),
      // 5th set
      featureSecureCookieEnabled: showFeature(FEATURE_SECURE_COOKIE_ENABLED),
      featureAppInsightEnabled: showFeature(FEATURE_APP_INSIGHTS_ENABLED),
      featureProxyEnabled: showFeature(FEATURE_PROXY_ENABLED),
      featureTermsAndConditionsEnabled: showFeature(FEATURE_TERMS_AND_CONDITIONS_ENABLED),
      featureRedisEnabled: showFeature(FEATURE_REDIS_ENABLED),

      redis: {
        prefix: getConfigValue(REDIS_KEY_PREFIX),
        ttl: getConfigValue(REDIS_TTL),
      },
    })
})
