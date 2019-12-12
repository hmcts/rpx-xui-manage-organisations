import * as express from 'express'
import { config } from '../lib/config'
import { application } from '../lib/config/application.config'
import { http } from '../lib/http'
import { getTermsAndConditionsUrl } from './termsAndConditionsUtil'

async function getTermsAndConditions(req: express.Request, res: express.Response) {
    let errReport: any
    try {
        const url = getTermsAndConditionsUrl(config.services.termsAndConditions, application.idamClient)
        const response = await http.get(url)
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
