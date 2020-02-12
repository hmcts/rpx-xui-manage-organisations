import { AxiosResponse } from 'axios'
import * as express from 'express'
import * as otp from 'otp'
import { getConfigValue, getS2sSecret } from '../configuration'
import { SERVICE_S2S_PATH } from '../configuration/references'
import { application } from '../lib/config/application.config'
import { http } from '../lib/http'
import * as log4jui from '../lib/log4jui'

import * as propertiesVolume from '@hmcts/properties-volume'
import * as tunnel from '../lib/tunnel'
import { getHealth, getInfo } from '../lib/util'

const mountedSecrets = propertiesVolume.addTo({})
const s2sSecret = getS2sSecret(mountedSecrets) || 'AAAAAAAAAAAAAAAA'
const url = getConfigValue(SERVICE_S2S_PATH)
const microservice =  application.microservice
const logger = log4jui.getLogger('service user-profile')

export async function postS2SLease() {
  let request: AxiosResponse<any>
  console.log('NODE_CONFIG_ENV is now:', process.env.NODE_CONFIG_ENV)
  console.log('postS2SLease url:', url)
  if (process.env.NODE_CONFIG_ENV !== 'ldocker') {
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
    res.status(200).send('ExpertUI is Up')
})

router.get('/info', (req, res, next) => {
    res.status(200).send(getInfo(url))
})
export default router
