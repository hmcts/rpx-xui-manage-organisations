import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_CCD_COMPONENT_API_PATH } from '../configuration/references';
import { exists } from '../lib/util';

export async function handleAddressesRoute(req: Request, res: Response) {
  console.log('starting external address')
  const ccdComponentPath = getConfigValue(SERVICES_CCD_COMPONENT_API_PATH);
  try {
    console.log(ccdComponentPath, 'stenius', req.query.postcode)
    const apiUrl = getAddressUrl(ccdComponentPath, req.query.postcode as string);
    const response = await req.http.get(apiUrl);
    console.log(response, 'connor')
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
