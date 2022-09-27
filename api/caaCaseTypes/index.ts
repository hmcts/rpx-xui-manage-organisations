import { CaaCasesFilterType } from '../caaCases/enums';
import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { CASE_TYPES, SERVICES_MCA_PROXY_API_PATH } from '../configuration/references';
import { getApiPath, getRequestBody } from './caaCaseTypes.util';
import { handleRoleAssignments } from '../caaCases';
import { RoleAssignmentResponse } from '../caaCases/models/roleAssignmentResponse';

export async function handleCaaCaseTypes(req: Request, res: Response) {
  const caaCasesPageType = req.query.caaCasesPageType as string;
	const caaCasesFilterType: string = req.query.caaCasesFilterType as string;
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), getConfigValue(CASE_TYPES));
	
	let caaCasesFilterValue: string | string[] = req.query.caaCasesFilterValue as string;

  try {
		if (caaCasesFilterType && caaCasesFilterType === CaaCasesFilterType.AssigneeName) {
      const roleAssignments = await handleRoleAssignments(req);
      const roleAssignmentResponse: RoleAssignmentResponse[] = roleAssignments && roleAssignments.data && roleAssignments.data.roleAssignmentResponse;
      caaCasesFilterValue = roleAssignmentResponse.map(x => x.attributes.caseId);
    }

		const payload = getRequestBody(req.session.auth.orgId, caaCasesPageType, caaCasesFilterValue);

    const response = await req.http.post(path, payload);
    res.send(response.data);
  } catch (error) {
    res.status(500).send({
      errorMessage: error.data,
      errorStatusText: error.statusText,
    });
  }
}

export const router = Router({ mergeParams: true });
router.post('', handleCaaCaseTypes);

export default router;
