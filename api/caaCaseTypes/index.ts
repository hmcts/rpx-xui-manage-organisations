import { NextFunction, Response, Router } from 'express';
import { handleRoleAssignments } from '../caaCases';
import { CaaCasesFilterType, CaaCasesPageType } from '../caaCases/enums';
import { RoleAssignmentResponse } from '../caaCases/models/roleAssignmentResponse';
import { getConfigValue } from '../configuration';
import { CASE_TYPES, SERVICES_MCA_PROXY_API_PATH } from '../configuration/references';
import { EnhancedRequest } from '../models/enhanced-request.interface';
import { getApiPath, getRequestBody, addCaseConfiguration } from './caaCaseTypes.util';

export async function handleCaaCaseTypes(req: EnhancedRequest, res: Response, next: NextFunction) {
  const caaCasesPageType = req.query.caaCasesPageType as string;
  const caaCasesFilterType: string = req.query.caaCasesFilterType as string;
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), getConfigValue(CASE_TYPES));
  let caaCasesFilterValue: string | string[] = req.query.caaCasesFilterValue as string;

  try {
    if (caaCasesPageType === CaaCasesPageType.AssignedCases && caaCasesFilterType === CaaCasesFilterType.AssigneeName) {
      const roleAssignments = await handleRoleAssignments(req, next);
      const roleAssignmentResponse: RoleAssignmentResponse[] = roleAssignments && roleAssignments.data && roleAssignments.data.roleAssignmentResponse;
      // in the unliekely event that no role assignments are found, set an array with an empty string
      if (!roleAssignmentResponse || roleAssignmentResponse.length === 0) {
        caaCasesFilterValue = [''];
      } else {
        caaCasesFilterValue = roleAssignmentResponse.map((x) => x.attributes.caseId);
      }
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
    const payload = getRequestBody(orgId, caaCasesPageType, caaCasesFilterValue);

    const response = await req.http.post(path, payload);
    addCaseConfiguration(response);
    res.send(response.data);
  } catch (error) {
    res.status(500).send({
      errorMessage: error.data,
      errorStatusText: error.statusText
    });
  }
}

export const router = Router({ mergeParams: true });
router.post('', handleCaaCaseTypes);

export default router;
