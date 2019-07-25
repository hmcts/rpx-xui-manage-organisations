import axios, { AxiosInstance } from 'axios'
import * as jwtDecode from 'jwt-decode'
import { config } from '../lib/config'
import * as log4jui from '../lib/log4jui'
import { asyncReturnOrError } from '../lib/util'
import { postS2SLease } from '../services/serviceAuth'

const logger = log4jui.getLogger('service-token')

const _cache = {}
const microservice = config.microservice

export function validateCache() {
    logger.info('validaing s2s cache')
    const currentTime = Math.floor(Date.now() / 1000)
    if (!_cache[microservice]) {
        return false
    }
    return currentTime < _cache[microservice].expiresAt
}

export function getToken() {
    return _cache[microservice]
}

export async function generateToken() {
    logger.info('Getting new s2s token')
    const token = await postS2SLease()

    const tokenData: any = jwtDecode(token)

    _cache[microservice] = {
        expiresAt: tokenData.exp,
        token,
    }

    return token
}

export async function serviceTokenGenerator() {
    if (validateCache()) {
        logger.info('Getting cached s2s token')
        const tokenData = getToken()
        return tokenData.token
    } else {
        return await generateToken()
    }
}

export default async (req, res, next) => {
    const configEnv = process ? process.env.PUI_ENV || 'local' : 'local'

    const token = await asyncReturnOrError(generateToken(), 'Error getting s2s token', res, logger)
    if (token) {
        logger.info('Adding s2s token to defaults')
        req.headers.ServiceAuthorization = `Bearer ${token}`

        axios.defaults.headers.common.ServiceAuthorization = req.headers.ServiceAuthorization

        next()
    }
}
