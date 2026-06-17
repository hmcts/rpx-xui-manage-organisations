import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_TERMS_AND_CONDITIONS_API_PATH } from '../configuration/references';
import { application } from '../lib/config/application.config';
import { getTermsAndConditionsUrl } from './termsAndConditionsUtil';
import { objectContainsOnlySafeCharacters, valueOrNull } from '../lib/util';

async function getTermsAndConditions(req: Request, res: Response) {
  let errReport: any;
  try {
    const apiUrl = getTermsAndConditionsUrl(getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH), application.idamClient);
    const response = await req.http.get(apiUrl);
    if (!objectContainsOnlySafeCharacters(response.data)) {
      return res.status(400).send('Invalid terms and condition data');
    }
    res.send(response.data);
  } catch (error) {
    const status = Number(valueOrNull(error, 'status')) || 500;
    if (status === 404) {
      res.send(null);
      return;
    }
    errReport = {
      apiError: valueOrNull(error, 'data.message'),
      apiStatusCode: status,
      message: 'Terms and Conditions route error'
    };
    res.status(status).send(errReport);
  }
}

export const router = Router({ mergeParams: true });
router.get('', getTermsAndConditions);
export default getTermsAndConditions;
