import axios, { AxiosResponse } from 'axios'
import * as express from 'express'
import * as jwtDecode from 'jwt-decode'
import * as log4js from 'log4js'
import { config } from '../lib/config'
import { http } from '../lib/http'
import { EnhancedRequest } from '../lib/models'
import { asyncReturnOrError } from '../lib/util'
import { getUserDetails } from '../services/idam'
import { serviceTokenGenerator } from './serviceToken'

const secret = process.env.IDAM_SECRET
const logger = log4js.getLogger('auth')
logger.level = config.logging

export async function attach(req: EnhancedRequest, res: express.Response, next: express.NextFunction) {
    const session = req.session!
    const accessToken = req.cookies[config.cookies.token]

    let expired

    if (accessToken) {
        const jwtData = jwtDecode(accessToken)
        const expires = new Date(jwtData.exp).getTime()
        const now = new Date().getTime() / 1000
        expired = expires < now
    }
    if (!accessToken || expired) {
        logger.info('Auth Token expired!')
        doLogout(req, res, 401)
    } else {
        const check = await sessionChainCheck(req, res, accessToken)
        if (check) {
            logger.info('Attaching auth')
            // also use these as axios defaults
            logger.info('Using Idam Token in defaults')
            axios.defaults.headers.common.Authorization = `Bearer ${session.auth.token}`
            const token = await asyncReturnOrError(serviceTokenGenerator(), 'Error getting s2s token', res, logger)
            if (token) {
                logger.info('Using S2S Token in defaults')
                axios.defaults.headers.common.ServiceAuthorization = token
            } else {
                logger.warn('Cannot attach S2S token ')
                doLogout(req, res, 401)
            }
        }

        next()
    }
}

export async function getTokenFromCode(req: express.Request, res: express.Response): Promise<AxiosResponse> {
    console.log(`${config.idamClient}:${secret}`)
    const Authorization = `Basic ${new Buffer(`${config.idamClient}:${secret}`).toString('base64')}`
    const options = {
        headers: {
            Authorization,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }

    logger.info('Getting Token from auth code.')

    console.log(
        `${config.services.idamApi}/oauth2/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${
            config.protocol
        }://${req.headers.host}${config.oauthCallbackUrl}`
    )
    return http.post(
        `${config.services.idamApi}/oauth2/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${
            config.protocol
        }://${req.headers.host}${config.oauthCallbackUrl}`,
        {},
        options
    )
}

async function sessionChainCheck(req: EnhancedRequest, res: express.Response, accessToken: string) {
    if (!req.session.auth) {
        logger.warn('Session expired. Trying to get user details again')
        console.log(getUserDetails(accessToken))
        const details = await asyncReturnOrError(getUserDetails(accessToken), 'Cannot get user details', res, logger, false)

        if (details) {
            logger.info('Setting session')
            const orgIdResponse = {
                data: {
                    id: '1',
                },
            }
            req.session.auth = {
                email: details.data.email,
                orgId: orgIdResponse.data.id,
                roles: details.data.roles,
                token: accessToken,
                userId: details.data.id,
            }
        }
    }

    if (!req.session.auth) {
        logger.warn('Auth token  expired need to log in again')
        doLogout(req, res, 401)
        return false
    }

    return true
}

export async function oauth(req: EnhancedRequest, res: express.Response, next: express.NextFunction) {
    const response = await getTokenFromCode(req, res)
    const accessToken = response.data.access_token

    if (accessToken) {
        // set browser cookie
        res.cookie(config.cookies.token, accessToken)

        const jwtData: any = jwtDecode(accessToken)
        const expires = new Date(jwtData.exp).getTime()
        const now = new Date().getTime() / 1000
        const expired = expires < now

        if (expired) {
            logger.warn('Auth token  expired need to log in again')
            doLogout(req, res, 401)
        } else {
            let orgId
            let details

            const check = await sessionChainCheck(req, res, accessToken)
            if (check) {
                axios.defaults.headers.common.Authorization = `Bearer ${req.session.auth.token}`
                axios.defaults.headers.common['user-roles'] = req.session.auth.roles

                if (req.headers.ServiceAuthorization) {
                    axios.defaults.headers.common.ServiceAuthorization = req.headers.ServiceAuthorization
                }

                logger.info('save session', req.session)
                req.session.save(() => {
                    res.redirect(config.indexUrl || '/')
                })
            }
        }
    } else {
        logger.error('No user-profile token')
        res.redirect(config.indexUrl || '/')
    }
}

export function doLogout(req: EnhancedRequest, res: express.Response, status: number = 302) {
    res.clearCookie(config.cookies.token)
    res.clearCookie(config.cookies.userId)
    req.session.user = null
    req.session.save(() => {
        res.redirect(status, req.query.redirect || '/')
    })
}

export function logout(req, res) {
    doLogout(req, res, 200)
}
