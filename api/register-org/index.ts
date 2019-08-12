import * as express from 'express'
import {http} from '../lib/http'
import {generateS2sToken} from '../lib/s2sTokenGeneration'
import {config} from '../lib/config';
import {makeOrganisationPayload} from '../lib/payloadBuilder';

export const router = express.Router({mergeParams: true})

router.post('/register', async (req, res) => {

  console.log('in /register')

  // TODO: Should be in common constants
  const ERROR_GENERATING_S2S_TOKEN = 'Error generating S2S Token'

  const s2sServicePath = config.services.s2s
  const rdProfessionalPath = config.services.rdProfessionalApi

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
      headers: {'ServiceAuthorization': `Bearer ${s2sToken}`},
    }
    const response = await http.post(url, registerPayload, options)

    res.send(response.data)
  } catch (error) {
    /**
     * If there is a error generating the S2S token then we flag it to the UI.
     */
    if (error === ERROR_GENERATING_S2S_TOKEN) {
      res.status(500)
      res.send({
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
