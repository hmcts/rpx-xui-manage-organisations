import { NextFunction, Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_MCA_PROXY_API_PATH, SERVICES_ROLE_ASSIGNMENT_API_PATH } from '../configuration/references';
import { EnhancedRequest } from '../models/enhanced-request.interface';
import { getApiPath, getRequestBody, mapCcdCases } from './caaCases.util';
import { CaaCasesFilterType } from './enums';
import { RoleAssignmentResponse } from './models/roleAssignmentResponse';

export async function handleCaaCases(req: EnhancedRequest, res: Response, next: NextFunction) {
  const caseTypeId = req.query.caseTypeId as string;
  const caaCasesPageType = req.query.caaCasesPageType as string;
  const caaCasesFilterType = req.query.caaCasesFilterType as string;
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), caseTypeId);
  const page: number = (+req.query.pageNo || 1) - 1;
  const size: number = (+req.query.pageSize);
  const fromNo: number = page * size;

  let caaCasesFilterValue: string | string[] = req.query.caaCasesFilterValue as string;
  const caseFilterType = req.query.caaCasesFilterType as string;
  try {
    if (caaCasesFilterType === CaaCasesFilterType.AssigneeName) {
      const roleAssignments = await handleRoleAssignments(req, next);
      const roleAssignmentResponse: RoleAssignmentResponse[] = roleAssignments && roleAssignments.data && roleAssignments.data.roleAssignmentResponse;
      caaCasesFilterValue = roleAssignmentResponse.map((x) => x.attributes.caseId);
    }

    const orgId = req.session.auth.orgId;

    if (!orgId || orgId === '') {
      // send error if organisation ID not present
      const errReport = {
        errorMessage: 'Cannot get organisation ID',
        apiStatusCode: 400
      };
      res.status(errReport.apiStatusCode).send(errReport);
    }

    const payload = getRequestBody(orgId, fromNo, size, caaCasesPageType, caseFilterType, caaCasesFilterValue);

    const response = await req.http.post(path, payload);
    const caaCases = mapCcdCases(caseTypeId, response.data);
    res.send(caaCases);
  } catch (error) {
    next(error);
  }
}

export async function handleRoleAssignments(req: Request, next: NextFunction): Promise<any> {
  const path = `${getConfigValue(SERVICES_ROLE_ASSIGNMENT_API_PATH)}/am/role-assignments/query`;
  const payload = {
    actorId: [req.query.caaCasesFilterValue],
    roleType: ['CASE']
  };

  try {
    const response = await req.http.post(path, payload);
    return response;
  } catch (error) {
    next(error);
  }
}

export const router = Router({ mergeParams: true });
router.post('', handleCaaCases);

export default router;
