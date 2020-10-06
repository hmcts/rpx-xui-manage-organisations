import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { CASE_TYPES, SERVICES_MCA_PROXY_API_PATH } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import { getApiPath, getRequestBody } from './unassignedCaseTypes.util'

export async function handleUnassignedCaseTypes(req: Request, res: Response) {
    const logger = log4jui.getLogger('caseTypes')
    const payload = getRequestBody(req.session.auth.orgId)
    logger.info('ernest', getConfigValue(SERVICES_MCA_PROXY_API_PATH))
    const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), getConfigValue(CASE_TYPES))
    try {
        const response = await req.http.post(path, payload)
        res.send(response.data)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            errorMessage: error.data,
            errorStatusText: error.statusText,
          })
    }
}

export const router = Router({ mergeParams: true })

router.post('', handleUnassignedCaseTypes)

export default router
