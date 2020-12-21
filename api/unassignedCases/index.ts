import { NextFunction, Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_MCA_PROXY_API_PATH } from '../configuration/references'
import { getApiPath, getRequestBody, mapCcdCases } from './unassingedCases-util'

export async function handleUnassignedCases(req: Request, res: Response, next: NextFunction) {
  const caseTypeId = req.query.caseTypeId as string
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), caseTypeId)
  const payload = getRequestBody(req.session.auth.orgId)
  try {
        const response = await req.http.post(path, payload)
        const unassingedCases = mapCcdCases(caseTypeId, response.data)
        res.send(unassingedCases)
  } catch (error) {
    next(error)
  }
}

export const router = Router({ mergeParams: true })

router.post('', handleUnassignedCases)

export default router
