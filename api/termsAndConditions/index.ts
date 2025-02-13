import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_TERMS_AND_CONDITIONS_API_PATH } from '../configuration/references';
import { application } from '../lib/config/application.config';
import { getTermsAndConditionsUrl } from './termsAndConditionsUtil';
import { containsDangerousCode, objectContainsOnlySafeCharacters } from '../lib/util';

async function getTermsAndConditions(req: Request, res: Response) {
  let errReport: any;
  try {
    const apiUrl = getTermsAndConditionsUrl(getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH), application.idamClient);
    if (!containsDangerousCode(apiUrl)) {
      return res.send('Invalid API link').status(400);
    }
    const response = await req.http.get(apiUrl);
    if (!objectContainsOnlySafeCharacters(response.data)) {
      return res.send('Invalid terms and condition data').status(400);
    }
    res.send(response.data);
  } catch (error) {
    if (error.status === 404) {
      res.send(null);
      return;
    }
    errReport = {
      apiError: error.data.message,
      apiStatusCode: error.status,
      message: 'Terms and Conditions route error'
    };
    res.status(error.status).send(errReport);
  }
}

export const router = Router({ mergeParams: true });
router.get('', getTermsAndConditions);
export default getTermsAndConditions;
