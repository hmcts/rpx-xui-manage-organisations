import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { CASE_TYPES, SERVICES_MCA_PROXY_API_PATH } from '../configuration/references';
import { getApiPath, getRequestBody } from './caaCaseTypes.util';

export async function handleCaaCaseTypes(req: Request, res: Response) {
  const caaCasesPageType = req.query.caaCasesPageType as string;
  const payload = getRequestBody(req.session.auth.orgId, caaCasesPageType);
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), getConfigValue(CASE_TYPES));
  try {
    const response = await req.http.post(path, payload);
		
		if (caaCasesPageType === 'unassigned-cases') {
			response.data = { 'total': 0, 'cases': [], 'case_types_results': [] };
		}
		
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
