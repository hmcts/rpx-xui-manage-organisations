import { Request, Response, Router } from 'express'
import { getConfigValue } from '../configuration'
import { CASE_TYPES, SERVICES_MCA_PROXY_API_PATH } from '../configuration/references'
import { getApiPath, getRequestBody } from './caaCaseTypes.util'

export async function handleCaaCaseTypes(req: Request, res: Response) {
  const payload = getRequestBody(req.session.auth.orgId);
  const path = getApiPath(getConfigValue(SERVICES_MCA_PROXY_API_PATH), getConfigValue(CASE_TYPES));
  try {
    const response = await req.http.post(path, payload);
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      errorMessage: error.data,
      errorStatusText: error.statusText,
    });
  }
}

export const router = Router({ mergeParams: true });
router.post('', handleCaaCaseTypes);

export default router;
