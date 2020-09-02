import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_CCD_DATA_STORE_API_PATH } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import { createCaseTypeResponse, getApiPath } from './unassignedCases.util'

export async function handleUnassignedCaseTypes(req: Request, res: Response) {
    const logger = log4jui.getLogger('caseTypes')
    console.log(req.body)
    const payload = req.body

    const rdProfessionalApiPath = getApiPath(getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH))
    try {
        // const response = await req.http.post(rdProfessionalApiPath, payload)
        res.send(createCaseTypeResponse())
        // res.send(response.data)
    } catch (error) {
        logger.info(error)
        const errReport = JSON.stringify({
            apiError: error,
            apiStatusCode: error.statusCode ? error.statusCode : 500,
            message: error.message ? error.message : '',
        })
        res.status(500).send(errReport)
    }
}

export const router = Router({ mergeParams: true })

router.post('', handleUnassignedCaseTypes)

export default router
