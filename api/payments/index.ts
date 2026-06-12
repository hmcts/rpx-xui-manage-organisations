import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_FEE_AND_PAY_API_PATH } from '../configuration/references';
import { objectContainsOnlySafeCharacters, valueOrNull } from '../lib/util';

async function handleAddressRoute(req: Request, res: Response) {
  let errReport: any;
  if (!req.params.account) {
    errReport = {
      apiError: 'Account is missing',
      apiStatusCode: '400',
      message: 'Fee And Pay route error'
    };
    res.status(400).send(errReport);
  }
  try {
    const response = await req.http.get(
      `${getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)}/pba-accounts/${req.params.account}/payments/`
    );
    if (!objectContainsOnlySafeCharacters(response.data.payments)) {
      return res.status(400).send('Invalid payment data');
    }
    res.send(response.data.payments);
  } catch (error) {
    const status = Number(valueOrNull(error, 'status')) || 500;
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
