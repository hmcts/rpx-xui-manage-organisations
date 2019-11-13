import * as express from 'express'
import { config } from '../lib/config'
import { application } from '../lib/config/application.config'
import { getUserTermsAndConditionsUrl } from './userTermsAndConditionsUtil'

async function getUserTermsAndConditions(req: express.Request, res: express.Response) {
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
        const url = getUserTermsAndConditionsUrl(config.services.termsAndConditions, req.params.userId, application.idamClient)
        // const response = await http.get(url)
        res.send(true)
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
}

export const router = express.Router({ mergeParams: true })
router.get('', getUserTermsAndConditions)
export default getUserTermsAndConditions
