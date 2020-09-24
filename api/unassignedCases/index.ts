import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_MCA_PROXY_API_PATH } from '../configuration/references'
import { getApiPath, getRequestBody, mapCcdCases } from './unassingedCases-util'

export async function handleUnassignedCases(req: Request, res: Response) {
  const caseTypeId = req.query.caseTypeId.toString()
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), 'FinancialRemedyConsentedRespondent')
  const payload = getRequestBody(req.session.auth.orgId)
  try {
        const response = await req.http.post(path, payload)
        const unassingedCases = mapCcdCases(response.data)
        res.send(unassingedCases)
  } catch (error) {
      console.log(error)
      res.status(500)
  }
}

export const router = Router({ mergeParams: true })

router.post('', handleUnassignedCases)

export default router
