import { NextFunction, Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { SERVICES_MCA_PROXY_API_PATH, SERVICES_ROLE_ASSIGNMENT_API_PATH } from '../configuration/references'
import { getApiPath, getRequestBodyForAssignedCases, getRequestBodyForUnassignedCases, mapCcdCases } from './caaCases.util'
import { CaaCasesPageType } from './enums';
import { RoleAssignmentResponse } from './models/roleAssignmentResponse';

export async function handleCaaCases(req: Request, res: Response, next: NextFunction) {
  const caseTypeId = req.query.caseTypeId as string;
  const caaCasesPageType = req.query.caaCasesPageType as string;
  const caaCasesFilterType = req.query.caaCasesFilterType as string;
  const caaCasesFilterValue = req.query.caaCasesFilterValue as string;
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), caseTypeId);
  const page: number = (+req.query.pageNo || 1) - 1;
  const size: number = (+req.query.pageSize);
  const fromNo: number = page * size;

  try {

    const roleAssignments = await handleRoleAssignments(req);
    const roleAssignmentResponse: RoleAssignmentResponse[] = roleAssignments && roleAssignments.data && roleAssignments.data.roleAssignmentResponse;
    const caseIds = roleAssignmentResponse.map(x => x.attributes.caseId)

    console.log('CASE IDs', caseIds);

    const payload = caaCasesPageType === CaaCasesPageType.UnassignedCases
      ? getRequestBodyForUnassignedCases(req.session.auth.orgId, fromNo, size, caaCasesFilterType, caaCasesFilterValue)
      : getRequestBodyForAssignedCases(req.session.auth.orgId, fromNo, size, caaCasesFilterType, caaCasesFilterValue);

    const response = await req.http.post(path, payload);
    const caaCases = mapCcdCases(caseTypeId, response.data);
    res.send(caaCases);
  } catch (error) {
    next(error);
  }
}

export async function handleRoleAssignments(req: Request): Promise<any> {
  const path = `${getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH)}/am/role-assignments/query`;
  const payload = {
    actorId: ['db17f6f7-1abf-4223-8b5e-1eece04ee5d8'],
    roleType: ['CASE']
  };

  try {
    const response = await req.http.post(path, payload);
    return response;

  } catch (error) {
    console.log('Error: ', error);
  }
}

export const router = Router({mergeParams: true});
router.post('', handleCaaCases);
// router.get('', handleRoleAssignments);

export default router;
