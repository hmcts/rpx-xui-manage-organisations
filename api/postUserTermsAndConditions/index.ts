import * as express from 'express'
import { PostUserAcceptTandCResponse } from '../interfaces/userAcceptTandCResponse'
import { config } from '../lib/config'
import { application } from '../lib/config/application.config'
import { http } from '../lib/http'
import { isUserTandCPostSuccessful } from '../lib/util'
import { postUserTermsAndConditionsUrl } from './termsAndConditionsUtil'

export async function postUserTermsAndConditions(req: express.Request, res: express.Response) {
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
        const url = postUserTermsAndConditionsUrl(config.services.termsAndConditions, application.idamClient)
        const response = await http.post(url, data)
        const postResponse = response.data as PostUserAcceptTandCResponse
        res.send(isUserTandCPostSuccessful(postResponse, req.body.userId))
    } catch (error) {
        errReport = {
            apiError: error.data.message,
            apiStatusCode: error.status,
            message: 'User Terms and Conditions route error',
        }
        res.status(error.status).send(errReport)
    }
}

export const router = express.Router({ mergeParams: true })
router.post('', postUserTermsAndConditions)
export default postUserTermsAndConditions
