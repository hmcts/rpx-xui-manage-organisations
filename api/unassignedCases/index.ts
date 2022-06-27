import { NextFunction, Response, Router } from 'express'
import { EnhancedRequest } from '../lib/models';
import { getConfigValue } from '../configuration'
import { SERVICES_MCA_PROXY_API_PATH } from '../configuration/references'
import { getApiPath, getRequestBody, mapCcdCases } from './unassingedCases-util'

export async function handleUnassignedCases(req: EnhancedRequest, res: Response, next: NextFunction) {
  const caseTypeId = req.query.caseTypeId as string
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), caseTypeId)
  const page: number = (+req.query.pageNo || 1) - 1;
  const size: number = (+req.query.pageSize);
  const fromNo: number = page * size;
  const payload = getRequestBody(req.session.auth.orgId, fromNo, size)

  try {
    const response = await req.http.post(path, payload)
    const unassignedCases = mapCcdCases(caseTypeId, response.data)
    res.send(unassignedCases)
  } catch (error) {
    next(error)
  }
}

export const router = Router({ mergeParams: true })

router.post('', handleUnassignedCases)

export default router
