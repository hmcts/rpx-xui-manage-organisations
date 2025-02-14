import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_FEE_AND_PAY_API_PATH } from '../configuration/references';
import { exists, objectContainsOnlySafeCharacters, containsDangerousCode, valueOrNull } from '../lib/util';

async function handleAddressRoute(req: Request, res: Response) {
  let errReport: any;
  if (!req.params.account) {
    errReport = {
      apiError: 'Account is missing',
      apiStatusCode: '400',
      message: 'Fee And Pay route error'
    };
    res.status(errReport.apiStatusCode).send(errReport);
  }
  try {
    if (containsDangerousCode(req.params.account)) {
      return res.send('Invalid account no').status(400);
    }
    const response = await req.http.get(
      `${getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)}/pba-accounts/${req.params.account}/payments/`
    );
    if (!objectContainsOnlySafeCharacters(response.data.payments)) {
      return res.send('Invalid payment data').status(400);
    }
    res.send(response.data.payments);
  } catch (error) {
    const status = exists(error, 'status') ? error.status : 500;
    errReport = {
      apiError: valueOrNull(error, 'data.message'),
      apiStatusCode: status,
      message: 'Fee And Pay route error'
    };
    res.status(status).send(errReport);
  }
}

export const router = Router({ mergeParams: true });

router.get('', handleAddressRoute);

export default router;
