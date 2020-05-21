import * as express from 'express'
import { getConfigValue } from '../configuration'
import { SERVICE_S2S_PATH, SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import {http} from '../lib/http'
import {makeOrganisationPayload} from '../lib/payloadBuilder'
import {generateS2sToken} from '../lib/s2sTokenGeneration'

export const router = express.Router({mergeParams: true})

router.post('/register', async (req, res) => {

  console.log('in /register')

  // TODO: Should be in common constants
  const ERROR_GENERATING_S2S_TOKEN = 'Error generating S2S Token'

  const s2sServicePath = getConfigValue(SERVICE_S2S_PATH)
  const rdProfessionalPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)

  const registerPayload = makeOrganisationPayload(req.body.fromValues)

  try {

    /**
     * S2S Token generation, if it fails, should send an error back to the UI, within the catch block.
     */
    const s2sToken = await generateS2sToken(s2sServicePath)

    /**
     * We use the S2S token to set the headers.
     */
    console.log(s2sToken)
    const url = `${rdProfessionalPath}/refdata/internal/v1/organisations`
    const options = {
      headers: { ServiceAuthorization: `Bearer ${s2sToken}` },
    }
    const axiosInstance = http({} as unknown as express.Request)
    const response = await axiosInstance.post(url, registerPayload, options)

    res.send(response.data)
  } catch (error) {
    /**
     * If there is a error generating the S2S token then we flag it to the UI.
     */
    if (error.message === ERROR_GENERATING_S2S_TOKEN) {
      return res.status(500).send({
        errorMessage: ERROR_GENERATING_S2S_TOKEN,
        errorOnPath: s2sServicePath,
      })
    }

    const errReport = {
      apiError: error.data.errorMessage,
      apiErrorDescription: error.data.errorDescription,
      statusCode: error.status,
    }
    res.status(error.status)
    res.send(errReport)
  }
});

export default router
