import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_MCA_PROXY_API_PATH } from '../configuration/references'
import { getApiPath, getRequestBody } from './unassingedCases-util'

export async function handleUnassignedCases(req: Request, res: Response) {
  const caseTypeId = req.query.caseTypeId.toString()
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), 'FinancialRemedyConsentedRespondent')
  const payload = getRequestBody(req.session.auth.orgId)
  try {
        console.log('payload is ', JSON.stringify(payload))
        const response = await req.http.post(path, payload)
        res.send(response.data)
  } catch (error) {
      console.log(error)
      res.status(500)
  }
}

export const router = Router({ mergeParams: true })

router.post('', handleUnassignedCases)

export default router
