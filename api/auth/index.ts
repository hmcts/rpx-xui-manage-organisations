import axios, { AxiosPromise, AxiosResponse } from 'axios'
import * as exceptionFormatter from 'exception-formatter'
import * as express from 'express'
import * as jwtDecode from 'jwt-decode'
import * as log4js from 'log4js'
import config from '../lib/config'
import { http } from '../lib/http'
import { EnhancedRequest } from '../lib/models'
import { serviceTokenGenerator } from './serviceToken'

const secret = process.env.IDAM_SECRET
const logger = log4js.getLogger('auth')
logger.level = config.logging

export async function attach(req: EnhancedRequest, res: express.Response, next: express.NextFunction) {
    const session = req.session!

    try {
        const token = await serviceTokenGenerator()

        req.headers.ServiceAuthorization = token.token

        const userId = session.auth.userId
        const jwt = session.auth.token
        const roles = session.auth.roles

        const jwtData = jwtDecode(jwt)
        const expires = new Date(jwtData.exp).getTime()
        const now = new Date().getTime() / 1000
        const expired = expires < now

        logger.info('Attaching auth')

        if (expired) {
            logger.info('Could not add S2S token header')
            res.status(401).send('Token expired!')
        } else {
            req.auth = jwtData
            req.auth.token = jwt
            req.auth.userId = userId
            req.auth.expires = expires
            req.auth.roles = roles
            // also use these as axios defaults
            logger.info('Using Idam Token in defaults')
            axios.defaults.headers.common.Authorization = `Bearer ${req.auth.token}`
            if (req.headers.ServiceAuthorization) {
                logger.info('Using S2S Token in defaults')
                axios.defaults.headers.common.ServiceAuthorization = req.headers.ServiceAuthorization
            }
            next()
        }
    } catch (exception) {
        logger.error('Could not add S2S token header', exceptionFormatter(exception, config.exceptionOptions))
    }
}

export async function getTokenFromCode(req: express.Request, res: express.Response): Promise<AxiosResponse> {
    const Authorization = `Basic ${new Buffer(`${config.services.idam.idamClientID}:${secret}`).toString('base64')}`
    const options = {
        headers: {
            Authorization,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }

    logger.info('Getting Token from auth code.')

    return http.post(
        `${config.services.idam.idamApiUrl}/oauth2/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${
        config.protocol
        }://${req.headers.host}${config.services.idam.oauthCallbackUrl}`,
        {},
        options
    )
}

export async function getUserDetails(jwt: string): Promise<AxiosResponse> {
    const options = {
        headers: { Authorization: `Bearer ${jwt}` },
    }

    return await http.get(`${config.services.idam.idamApiUrl}/details`, options)
}

export async function oauth(req: EnhancedRequest, res: express.Response, next: express.NextFunction) {
    const session = req.session!

    try {
        const response = await getTokenFromCode(req, res)

        if (response.data.access_token) {
            logger.info('Getting user details')
            const details: any = await getUserDetails(response.data.access_token)
            res.cookie(config.cookies.token, response.data.access_token)
            session.auth = {
                roles: details.data.roles,
                token: response.data.access_token,
                userId: details.data.id,
            }

            session.save(() => {
                res.redirect(config.indexUrl)
            })
        }
    } catch (e) {
        logger.error('Error:', e)
        res.redirect(config.indexUrl || '/')
    }
}

export function user(req: EnhancedRequest, res: express.Response) {
    const userJson = {
        expires: req.auth.expires,
        roles: req.auth.roles,
        userId: req.auth.userId,
    }
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(userJson))
}

// export function storeUrl(req: express.Request, res: express.Response, next: express.NextFunction) {
//     const session = req.session
//     session.url = req.path
//     next()
// }

// export function redirectUrl(req, res) {
//     const session = req.session
//     if (!session.url) {
//         res.redirect(config.indexUrl || '/')
//     } else {
//         if (req.path !== session.url) {
//             res.redirect(session.url)
//         }
//     }
// }

export function logout(req: EnhancedRequest, res: express.Response) {
    const redirect = config.indexUrl ? config.indexUrl : '/'
    res.clearCookie(config.cookies.token)
    res.redirect(redirect)
}
