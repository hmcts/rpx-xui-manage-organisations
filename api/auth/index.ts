import {AUTH, AuthOptions, xuiNode} from '@hmcts/rpx-xui-node-lib'
import {NextFunction, Request, Response} from 'express'
import {getConfigValue, showFeature} from '../configuration'
import {
  COOKIE_TOKEN,
  FEATURE_OIDC_ENABLED,
  FEATURE_REDIS_ENABLED,
  FEATURE_SECURE_COOKIE_ENABLED,
  IDAM_CLIENT,
  IDAM_SECRET,
  LOGIN_ROLE_MATCHER,
  MICROSERVICE,
  NOW,
  OAUTH_CALLBACK_URL,
  REDIS_KEY_PREFIX,
  REDIS_TTL,
  REDISCLOUD_URL,
  S2S_SECRET,
  SERVICE_S2S_PATH,
  SERVICES_IDAM_API_PATH,
  SERVICES_IDAM_ISS_URL,
  SERVICES_IDAM_WEB, SERVICES_RD_PROFESSIONAL_API_PATH,
  SESSION_SECRET
} from '../configuration/references'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'
import {getOrganisationDetails} from '../organisation'

const logger = log4jui.getLogger('auth')

export const successCallback = async (req: Request, res: Response, next: NextFunction) => {
    const {accessToken} = req.session.passport.user.tokenset
    const {userinfo} = req.session.passport.user

    logger.info('Setting session and cookies')
    // set browser cookie
    res.cookie(getConfigValue(COOKIE_TOKEN), accessToken)

    if (!req.session.auth) {
      const auth = {
        email: userinfo.sub || userinfo.email,
        orgId: '-1',
        roles: userinfo.roles,
        token: accessToken,
        userId: userinfo.uid || userinfo.id
      }

      const authRequest = {
        http: http({
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'user-roles': userinfo.roles,
            ServiceAuthorization: req.headers.ServiceAuthorization
          }
        } as unknown as Request)
      }

      try {
        const orgDetails = await getOrganisationDetails(authRequest as unknown as Request, getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH))
        auth.orgId = orgDetails.data.organisationIdentifier
      } catch (e) {
        console.log(e)
      }

      req.session.auth = auth

    }

    if (!req.isRefresh) {
        return res.redirect('/')
    }
    next()
}

xuiNode.on(AUTH.EVENT.AUTHENTICATE_SUCCESS, successCallback)

export const getXuiNodeMiddleware = () => {

    const idamWebUrl = getConfigValue(SERVICES_IDAM_WEB)
    const authorizationUrl = `${idamWebUrl}/login`
    const secret = getConfigValue(IDAM_SECRET)
    const idamClient = getConfigValue(IDAM_CLIENT)
    const issuerUrl = getConfigValue(SERVICES_IDAM_ISS_URL)
    const idamApiPath = getConfigValue(SERVICES_IDAM_API_PATH)
    const s2sSecret = getConfigValue(S2S_SECRET)
    const tokenUrl = `${getConfigValue(SERVICES_IDAM_API_PATH)}/oauth2/token`

    // TODO: we can move these out into proper config at some point to tidy up even further
    const options: AuthOptions = {
        allowRolesRegex: getConfigValue(LOGIN_ROLE_MATCHER),
        authorizationURL: authorizationUrl,
        callbackURL: getConfigValue(OAUTH_CALLBACK_URL),
        clientID: idamClient,
        clientSecret: secret,
        discoveryEndpoint: `${idamWebUrl}/o`,
        issuerURL: issuerUrl,
        logoutURL: idamApiPath,
        responseTypes: ['code'],
        scope: 'profile openid roles manage-user create-user manage-roles',
        sessionKey: 'xui-mo-webapp',
        tokenEndpointAuthMethod: 'client_secret_post',
        tokenURL: tokenUrl,
        useRoutes: true,
    }

    const baseStoreOptions = {
        cookie: {
            httpOnly: true,
            maxAge: 1800000,
            secure: showFeature(FEATURE_SECURE_COOKIE_ENABLED),
        },
        name: 'xui-mo-webapp',
        resave: false,
        saveUninitialized: false,
        secret: getConfigValue(SESSION_SECRET),
    }

    const redisStoreOptions = {
        redisStore: {
            ...baseStoreOptions, ...{
                redisStoreOptions: {
                    redisCloudUrl: getConfigValue(REDISCLOUD_URL),
                    redisKeyPrefix: getConfigValue(REDIS_KEY_PREFIX),
                    redisTtl: getConfigValue(REDIS_TTL),
                },
            },
        },
    }

    const fileStoreOptions = {
        fileStore: {
            ...baseStoreOptions, ...{
                fileStoreOptions: {
                    filePath: getConfigValue(NOW) ? '/tmp/sessions' : '.sessions',
                },
            },
        },
    }

    const nodeLibOptions = {
        auth: {
            s2s: {
                microservice: getConfigValue(MICROSERVICE),
                s2sEndpointUrl: `${getConfigValue(SERVICE_S2S_PATH)}/lease`,
                s2sSecret: s2sSecret.trim(),
            },
        },
        session: showFeature(FEATURE_REDIS_ENABLED) ? redisStoreOptions : fileStoreOptions,
    }

    const type = showFeature(FEATURE_OIDC_ENABLED) ? 'oidc' : 'oauth2'
    nodeLibOptions.auth[type] = options
    logger._logger.info('Setting XuiNodeLib options')
    return xuiNode.configure(nodeLibOptions)
}

export async function attach(req: Request, res: Response, next: NextFunction) {
  // TODO: req now has req.headers.Authorization/ServiceAuthorization, so might be worthwhile replacing this in future
  if (!req.http) {
    req.http = http(req)
  }
  next()
}
