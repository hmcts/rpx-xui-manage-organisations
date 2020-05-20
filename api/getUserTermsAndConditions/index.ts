import * as express from 'express'
import { getConfigValue, showFeature } from '../configuration'
import { FEATURE_TERMS_AND_CONDITIONS_ENABLED, SERVICES_TERMS_AND_CONDITIONS_API_PATH } from '../configuration/references'
import { GetUserAcceptTandCResponse } from '../interfaces/userAcceptTandCResponse'
import { application } from '../lib/config/application.config'
import { http } from '../lib/http'
import { getUserTermsAndConditionsUrl } from './userTermsAndConditionsUtil'

/**
 * getUserTermsAndConditions
 *
 * Temporary: If the Terms and Conditions feature is disabled. Then we currently return a 200 with true,
 * as we still need the User to get into the application, with the current Production build on ASC.
 *
 * @param req
 * @param res
 */
async function getUserTermsAndConditions(req: express.Request, res: express.Response) {
    if (showFeature(FEATURE_TERMS_AND_CONDITIONS_ENABLED)) {
      console.log('T&Cs is enabled.')
      res.setHeader('debugger', 'T&Cs is enabled.')
      let errReport: any
      if (!req.params.userId) {
        errReport = {
          apiError: 'UserId is missing',
          apiStatusCode: '400',
          message: 'User Terms and Conditions route error',
        }
        res.status(400).send(errReport)
      }
      try {
        const url = getUserTermsAndConditionsUrl(getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH), req.params.userId, application.idamClient)
        const response = await http.get(url)
        const userTandCResponse = response.data as GetUserAcceptTandCResponse
        res.send(userTandCResponse.accepted)
      } catch (error) {
        // we get a 404 if the user has not agreed to Terms and conditions
        if (error.status === 404) {
          res.send(true)
          return
        }
        errReport = {
          apiError: error.data.message,
          apiStatusCode: error.status,
          message: 'User Terms and Conditions route error',
        }
        res.status(error.status).send(errReport)
      }
    } else {
      console.log('T&Cs is not enabled.')
      res.setHeader('debugger', 'T&Cs is not enabled.')
      res.status(200).send(true)
    }
}

export const router = express.Router({ mergeParams: true })
router.get('', getUserTermsAndConditions)
export default getUserTermsAndConditions
