import * as express from 'express'
import {http} from '../lib/http'
import { generateS2sToken } from '../lib/s2sTokenGeneration'
import {config} from '../lib/config';
import axios from 'axios';
import {logger} from 'codelyzer/util/logger';

export const router = express.Router({mergeParams: true})

// Works and we can hit it.
// TODO: First step would be to just get an error back if
// the S2S token generation does not work.
router.post('/register', async (req, res) => {

  const ERROR_GENERATING_S2S_TOKEN = 'Error generating S2S token'
  const SUCCESSFULLY_GENERATED_S2S_TOKEN = 'Successfully generated S2S token'

  let status

  console.log('prdTest')

  // console.log('+================================')
  // console.log(req.body)

  const rdProfessionalPath = config.services.rdProfessionalApi

  // TODO: If there is a probably with generation we should inform the User.
  try {
    // TODO: If we pass in the values, we'll know what to log in the error.
    const token = await generateS2sToken()
    // status = SUCCESSFULLY_GENERATED_S2S_TOKEN
    console.log('token')
    console.log(token)
  } catch (error) {
    console.log('error')
    console.log(error)
    logger.error(`Error generating S2S Token`)
    // status = ERROR_GENERATING_S2S_TOKEN
    // res.send({message: status})
  }

  // if (!token) {
  //   res.send('No token generated')
  // }
  //
  // logger.info('Adding s2s token to defaults')
  // req.headers.ServiceAuthorization = `Bearer ${token}`
  //
  // axios.defaults.headers.common.ServiceAuthorization = req.headers.ServiceAuthorization
  //
  // try {
  //   const response = await http.post(`${prdUrl}/refdata/internal/v1/organisations`, req.body)
  //   res.send(response.data)
  // } catch (error) {
  //   const errReport = {
  //     apiError: error.data.errorMessage,
  //     apiErrorDescription: error.data.errorDescription,
  //     statusCode: error.status,
  //   }
  //   console.log('error')
  //   console.log(error)
  //   res.send(errReport).status(418)
  // }
});

export default router
