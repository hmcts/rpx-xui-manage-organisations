import axios, {AxiosResponse} from 'axios'
import * as express from 'express'
import * as jwtDecode from 'jwt-decode'
import * as log4js from 'log4js'
import {getConfigValue, getProtocol} from '../configuration'
import {
  COOKIE_TOKEN, COOKIES_USERID, IDAM_CLIENT, IDAM_SECRET, INDEX_URL, LOGGING, OAUTH_CALLBACK_URL,
  SERVICES_IDAM_API_PATH
} from '../configuration/references'
import {http} from '../lib/http'
import {propsExist} from '../lib/objectUtilities'
import {asyncReturnOrError, exists} from '../lib/util'
import {getUserDetails} from '../services/idam'
import {serviceTokenGenerator} from './serviceToken'
import {userHasAppAccess} from './userRoleAuth'

const idamUrl = getConfigValue(SERVICES_IDAM_API_PATH)
const secret = getConfigValue(IDAM_SECRET)
const logger = log4js.getLogger('auth')
logger.level = getConfigValue(LOGGING)

export async function attach(req: express.Request, res: express.Response, next: express.NextFunction) {
  const accessToken = req.cookies[getConfigValue(COOKIE_TOKEN)]

  let expired

  if (accessToken) {
    const jwtData = jwtDecode(accessToken)
    const expires = new Date(jwtData.exp).getTime()
    const now = new Date().getTime() / 1000
    expired = expires < now
  }
  if (!accessToken || expired) {
    logger.info('Auth Token expired!')
    await doLogout(req, res, 401)
  } else {
    const check = await sessionChainCheck(req, res, accessToken)
    if (check) {
      logger.info('Attaching auth')
      // also use these as axios defaults
      logger.info('Using Idam Token in defaults')
      // axios.defaults.headers.common.Authorization = `Bearer ${session.auth.token}`
      req.http = http(req)
      const token = await asyncReturnOrError(serviceTokenGenerator(), 'Error getting s2s token', res, logger)
      if (token) {
        logger.info('Using S2S Token in defaults')

        axios.defaults.headers.common.ServiceAuthorization = token
      } else {
        logger.warn('Cannot attach S2S token ')
        await doLogout(req, res, 401)
      }
    }

    next()
  }
}

export async function getTokenFromCode(req: express.Request): Promise<AxiosResponse> {
  logger.info(`IDAM STUFF ===>> ${getConfigValue(IDAM_CLIENT)}:${secret}`)
  const Authorization = `Basic ${Buffer.from(`${getConfigValue(IDAM_CLIENT)}:${secret}`).toString('base64')}`
  const options = {
    headers: {
      Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
  const axiosInstance = http({} as unknown as express.Request)

  logger.info('Getting Token from auth code.')

  console.log(
    `${getConfigValue(SERVICES_IDAM_API_PATH)}/oauth2/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${
      getProtocol()
    }://${req.headers.host}${getConfigValue(OAUTH_CALLBACK_URL)}`
  )
  return axiosInstance.post(
    `${getConfigValue(SERVICES_IDAM_API_PATH)}/oauth2/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${
      getProtocol()
    }://${req.headers.host}${getConfigValue(OAUTH_CALLBACK_URL)}`,
    {},
    options
  )
}

async function sessionChainCheck(req: express.Request, res: express.Response, accessToken: string) {
  if (!req.session.auth) {
    logger.warn('Session expired. Trying to get user details again')
    console.log(getUserDetails(accessToken, idamUrl))
    const userDetails = await asyncReturnOrError(getUserDetails(accessToken, idamUrl), 'Cannot get user details', res, logger, false)

    if (!propsExist(userDetails, ['data', 'roles'])) {
      logger.warn('User does not have any access roles.')
      await doLogout(req, res, 401)
      return false
    }

    if (!userHasAppAccess(userDetails.data.roles)) {
      logger.warn('User has no application access, as they do not have a Manage Organisations role.')
      await doLogout(req, res, 401)
      return false
    }

    if (userDetails) {
      logger.info('Setting session')
      const orgIdResponse = {
        data: {
          id: '1',
        },
      }
      req.session.auth = {
        email: userDetails.data.email,
        orgId: orgIdResponse.data.id,
        roles: userDetails.data.roles,
        token: accessToken,
        userId: userDetails.data.id,
      }
    }
  }

  if (!req.session.auth) {
    logger.warn('Auth token  expired need to log in again')
    await doLogout(req, res, 401)
    return false
  }

  return true
}

export async function oauth(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.info('starting oauth callback')
  const response = await getTokenFromCode(req)
  const accessToken = response.data.access_token

  if (accessToken) {
    // set browser cookie
    res.cookie(getConfigValue(COOKIE_TOKEN), accessToken)

    const jwtData: any = jwtDecode(accessToken)
    const expires = new Date(jwtData.exp).getTime()
    const now = new Date().getTime() / 1000
    const expired = expires < now

    if (expired) {
      logger.warn('Auth token  expired need to log in again')
      await doLogout(req, res, 401)
    } else {
      const check = await sessionChainCheck(req, res, accessToken)
      if (check) {
        // axios.defaults.headers.common.Authorization = `Bearer ${req.session.auth.token}`
        // axios.defaults.headers.common['user-roles'] = req.session.auth.roles
        req.http = http(req)

        if (req.headers.ServiceAuthorization) {
          axios.defaults.headers.common.ServiceAuthorization = req.headers.ServiceAuthorization
        }

        logger.info('save session', req.session)
        req.session.save(() => {
          res.redirect(getConfigValue(INDEX_URL) || '/')
        })
      }
    }
  } else {
    logger.error('No user-profile token')
    res.redirect(getConfigValue(INDEX_URL) || '/')
  }
}

export async function doLogout(req: express.Request, res: express.Response, status: number = 302) {
  const auth = `Basic ${
    Buffer.from(`${getConfigValue(IDAM_CLIENT)}:${getConfigValue(IDAM_SECRET)
    }`).toString('base64')}`

  const axiosInstance = http({} as unknown as express.Request)

  if (exists(req, 'session.auth.token')) {
    await axiosInstance.delete(`${getConfigValue(SERVICES_IDAM_API_PATH)}/session/${req.session.auth.token}`, {
      headers: {
        Authorization: auth,
      }
    }).catch( err => {
      logger.error('Unable to delete idam session:', err)
    })
  }

  req.session.destroy(() => {
    res.clearCookie(getConfigValue(COOKIE_TOKEN))
    res.clearCookie(getConfigValue(COOKIES_USERID))
    res.redirect(status, `${req.query.redirect}` || '/')
  })
}

export async function logout(req, res) {
  await doLogout(req, res, 200)
}
