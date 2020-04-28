import * as express from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_TERMS_AND_CONDITIONS_API_PATH } from '../configuration/references'
import { application } from '../lib/config/application.config'
import { getTermsAndConditionsUrl } from './termsAndConditionsUtil'

async function getTermsAndConditions(req: express.Request, res: express.Response) {
    let errReport: any
    try {
        const url = getTermsAndConditionsUrl(getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH), application.idamClient)
        const response = await req.http.get(url)
        res.send(response.data)
    } catch (error) {
        if (error.status === 404) {
            res.send(null)
            return
        }
        errReport = {
            apiError: error.data.message,
            apiStatusCode: error.status,
            message: 'Terms and Conditions route error',
        }
        res.status(error.status).send(errReport)
    }
}

export const router = express.Router({ mergeParams: true })
router.get('', getTermsAndConditions)
export default getTermsAndConditions
