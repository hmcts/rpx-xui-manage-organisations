import * as express from 'express'
import * as otp from 'otp'
import { config } from '../../config'
import { http } from '../lib/http'
import { getHealth, getInfo } from '../lib/util'
import { AxiosResponse } from 'axios';
import * as log4jui from '../lib/log4jui'

const url = config.services.s2s
const microservice = config.microservice
const s2sSecret = process.env.S2S_SECRET || 'AAAAAAAAAAAAAAAA'

const logger = log4jui.getLogger('service auth')

export async function postS2SLease() {

    const configEnv = process ? process.env.PUI_ENV || 'local' : 'local'
    let request: AxiosResponse<any>

    if (configEnv !== 'local') {

        const oneTimePassword = otp({ secret: s2sSecret }).totp()

        logger.info('generating from secret  :', s2sSecret,
        microservice,
        oneTimePassword
        )

        request = await http.post(`${url}/lease`, {
            microservice,
            oneTimePassword,
        })
    } else {
        // this is only for local development against the RD docker image
        request = await http.get(url)
    }

    return request.data
}


export const router = express.Router({mergeParams: true})

router.get('/health', (req, res, next) => {
    res.status(200).send(getHealth(url))
})

router.get('/info', (req, res, next) => {
    res.status(200).send(getInfo(url))
})
export default router
