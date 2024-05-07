import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_CCD_COMPONENT_API_PATH } from '../configuration/references';
import { exists } from '../lib/util';

export async function handleAddressesRoute(req: Request, res: Response) {
  const ccdComponentPath = getConfigValue(SERVICES_CCD_COMPONENT_API_PATH);
  try {
    const apiUrl = getAddressUrl(ccdComponentPath, req.query.postcode as string);
    const response = await req.http.get(apiUrl);
    res.status(200).send(response.data);
  } catch (error) {
    const status = exists(error, 'statusCode') ? error.statusCode : 500;

    const errReport = {
      apiError: { ...error },
      apiStatusCode: status,
      message: 'External address route error'
    };
    res.status(status).send(errReport);
  }
}

export function getAddressUrl(ccdComponentPath: string, postcode: string): string {
  return `${ccdComponentPath}/addresses?postcode=${postcode}`;
}

export const router = Router({ mergeParams: true });

router.get('/', handleAddressesRoute);

export default router;
