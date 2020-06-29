import * as jwtDecode from 'jwt-decode'
import { getConfigValue } from '../configuration'
import { MICROSERVICE } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import { postS2SLease } from '../services/serviceAuth'

const logger = log4jui.getLogger('service-token')

const cache = {}
const microservice = getConfigValue(MICROSERVICE)

export function validateCache() {
    logger.info('validaing s2s cache')
    const currentTime = Math.floor(Date.now() / 1000)
    if (!cache[microservice]) {
        return false
    }
    return currentTime < cache[microservice].expiresAt
}

export function getToken() {
    return cache[microservice]
}

export async function generateToken() {
    logger.info('Getting new s2s token')
    const token = await postS2SLease()
   // console.log(token)
    const tokenData: any = jwtDecode(token)
    cache[microservice] = {
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
