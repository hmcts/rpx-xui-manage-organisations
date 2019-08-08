import * as express from 'express'
import {http} from '../lib/http'
import {generateS2sToken} from '../lib/s2sTokenGeneration'
import {config} from '../lib/config';
import axios from 'axios';
import {logger} from 'codelyzer/util/logger';

export const router = express.Router({mergeParams: true})

router.post('/register', async (req, res) => {

  console.log('in /register')

  // TODO: Should be in common constants
  const ERROR_GENERATING_S2S_TOKEN = 'Error generating S2S Token'

  const s2sServicePath = config.services.s2s
  const rdProfessionalPath = config.services.rdProfessionalApi

  const registerPayload = req.body

  /**
   * Check the payload comes in and is fine.
   */
  console.log('registerPayload')
  console.log(registerPayload)

  try {

    /**
     * S2S Token generation, if it fails, should send an error back to the UI, within the catch block.
     */
    const s2sToken = await generateS2sToken(s2sServicePath)
    logger.info(`Successfully generated S2S Token`)
    logger.info(s2sToken)

    /**
     * We use the S2S token to set the headers.
     */
    req.headers.ServiceAuthorization = `Bearer ${s2sToken}`
    axios.defaults.headers.common.ServiceAuthorization = req.headers.ServiceAuthorization

    const response = await http.post(`${rdProfessionalPath}/refdata/internal/v1/organisations`, req.body)

    res.send(response.data)
  } catch (error) {

    // Temporary while we are debugging.
    console.log('error')
    console.log(error)
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
})

export default router
