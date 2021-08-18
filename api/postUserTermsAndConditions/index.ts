import { Request, Response, Router } from 'express'
import {getConfigValue} from '../configuration'
import {SERVICES_TERMS_AND_CONDITIONS_API_PATH} from '../configuration/references'
import {PostUserAcceptTandCResponse} from '../interfaces/userAcceptTandCResponse'
import {application} from '../lib/config/application.config'
import {exists, isUserTandCPostSuccessful, valueOrNull} from '../lib/util'
import {postUserTermsAndConditionsUrl} from './termsAndConditionsUtil'

export async function postUserTermsAndConditions(req: Request, res: Response) {
  let errReport: any
  if (!req.body.userId) {
    errReport = {
      apiError: 'UserId is missing',
      apiStatusCode: '400',
      message: 'User Terms and Conditions route error',
    }
    res.status(400).send(errReport)
  }
  try {
    const data = {userId: req.body.userId}
    const url = postUserTermsAndConditionsUrl(getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH), application.idamClient)
    const response = await req.http.post(url, data)
    const postResponse = response.data as PostUserAcceptTandCResponse
    res.send(isUserTandCPostSuccessful(postResponse, req.body.userId))
  } catch (error) {
    const status = exists(error, 'status') ? error.status : 500
    errReport = {
      apiError: valueOrNull(error, 'data.message'),
      apiStatusCode: status,
      message: 'User Terms and Conditions route error',
    }
    res.status(status).send(errReport)
  }
}

export const router = Router({mergeParams: true})
router.post('', postUserTermsAndConditions)
export default postUserTermsAndConditions
