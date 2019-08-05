import { AxiosResponse } from 'axios'
import * as express from 'express'
import * as otp from 'otp'
import { config } from '../lib/config'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'
import { tunnel } from '../lib/tunnel'
import { getHealth, getInfo } from '../lib/util'
import {application} from '../lib/config/application.config'

const s2sSecret = '3GR7NM2LIN3IIVYE'
const url = config.services.s2s
// const microservice = 'rd_professional_api'
const microservice =  application.microservice
const logger = log4jui.getLogger('service user-profile')

export async function postS2SLease() {
  const configEnv = process ? process.env.PUI_ENV || 'local' : 'local'
  let request: AxiosResponse<any>
  console.log('PUI_ENV is now:', configEnv)
  if (configEnv !== 'ldocker') {
        const oneTimePassword = otp({ secret: s2sSecret }).totp()
        logger.info('generating from secret  :', s2sSecret, microservice, oneTimePassword)
        request = await http.post(`${url}/lease`, {
          microservice,
          oneTimePassword,
        })
    } else {
        // this is only for local development against the RD docker image
        // end tunnel before posting to docker
        tunnel.end()
        request = await http.get(`${url}`)
    }
  return request.data
}

export const router = express.Router({ mergeParams: true })

router.get('/health', (req, res, next) => {
    res.status(200).send(getHealth(url))
})

router.get('/info', (req, res, next) => {
    res.status(200).send(getInfo(url))
})
export default router
