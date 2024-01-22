import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, valueOrNull } from '../lib/util';
import { getRefdataAllUserListUrl } from '../refdataAllUserListUrlUtil';
import { jurisdictionsExample } from '../temp-data';

const logger = log4jui.getLogger('retrive-access-types');

export async function handleRetriveAccessTypes(req: Request, res: Response) {
  const payload = req.body;
  //   try {
  //     const rdProfessionalApiPath = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH);
  //     const url = `${rdProfessionalApiPath}/retrieve-access-types`;
  //     logger.info('INVITE USER: request URL:: ', url);
  //     logger.info('INVITE USER: payload:: ', payload);
  //     const response = await req.http.post(url, payload);
  //     logger.info('response::', response.data);
  //     res.send(response.data);
  //   } catch (error) {
  //     logger.error('error', error);
  //     const status = exists(error, 'status') ? error.status : 500;
  //     const errReport = {
  //       apiError: valueOrNull(error, 'data.errorMessage'),
  //       apiStatusCode: status,
  //       message: valueOrNull(error, 'data.errorDescription')
  //     };
  //     res.status(status).send(errReport);
  //   }

  res.json(JSON.parse(jurisdictionsExample));
}

export const router = Router({ mergeParams: true });

router.post('/', handleRetriveAccessTypes);

export default router;
