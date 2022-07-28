import { NextFunction, Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_MCA_PROXY_API_PATH } from '../configuration/references'
import { getApiPath, getRequestBodyForAssignedCases, getRequestBodyForUnassignedCases, mapCcdCases } from './caaCases.util'
import { CaaCasesPageType } from './enums';

export async function handleCaaCases(req: Request, res: Response, next: NextFunction) {
  const caseTypeId = req.query.caseTypeId as string;
  const caaCasesPageType = req.query.caaCasesPageType as string;
  const caaCasesFilterType = req.query.caaCasesFilterType as string;
  const caaCasesFilterValue = req.query.caaCasesFilterValue as string;
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), caseTypeId);
  const page: number = (+req.query.pageNo || 1) - 1;
  const size: number = (+req.query.pageSize);
  const fromNo: number = page * size;
  const payload = caaCasesPageType === CaaCasesPageType.unassignedCases
    ? getRequestBodyForUnassignedCases(req.session.auth.orgId, fromNo, size, caaCasesFilterType, caaCasesFilterValue)
    : getRequestBodyForAssignedCases(req.session.auth.orgId, fromNo, size, caaCasesFilterType, caaCasesFilterValue);

  try {
    const response = await req.http.post(path, payload);
    const caaCases = mapCcdCases(caseTypeId, response.data);
    res.send(caaCases);
  } catch (error) {
    next(error);
  }
}

export const router = Router({mergeParams: true});
router.post('', handleCaaCases);

export default router;
