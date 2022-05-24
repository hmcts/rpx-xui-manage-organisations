import { NextFunction, Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_MCA_PROXY_API_PATH } from '../configuration/references'
import { getApiPath, getRequestBody, getRequestBodyWithPageLimit, mapCcdCases } from './unassingedCases-util'
import * as log4jui from '../lib/log4jui'

export async function handleUnassignedCases(req: Request, res: Response, next: NextFunction) {
  const logger = log4jui.getLogger('Unassigned cases by Ritesh')
  const caseTypeId = req.query.caseTypeId as string
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), caseTypeId)
  var payload;
  // logger.info('page ', req.query.pageNo)
  // logger.info('size ', req.query.pageSize)
  logger.info('path ', path)
  if (req.query.pageNo && req.query.pageSize) {
    logger.info('hello1')
    const page: number = (+req.query.pageNo || 1) - 1;
    const size: number = (+req.query.pageSize);
    const fromNo: number = page * size;
    payload = getRequestBodyWithPageLimit(req.session.auth.orgId, fromNo, size)
  } else {
    logger.info('hello2')
    payload = getRequestBody(req.session.auth.orgId)
  }

  try {
    const response = await req.http.post(path, payload)
    const unassignedCases = mapCcdCases(caseTypeId, response.data)
    res.send(unassignedCases)
  } catch (error) {
    next(error)
  }
}

export const router = Router({mergeParams: true})

router.post('', handleUnassignedCases)

export default router
