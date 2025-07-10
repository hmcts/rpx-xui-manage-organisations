import { Request, Response, Router } from 'express';
import { getConfigValue } from '../configuration';
import { APP_INSIGHTS_CONNECTION_STRING } from '../configuration/references';
import { exists } from '../lib/util';

export async function handleConnectionStringRoute(req: Request, res: Response) {
  try {
    res.send({ key: getConfigValue(APP_INSIGHTS_CONNECTION_STRING) });
  } catch (error) {
    const status = exists(error, 'statusCode') ? error.statusCode : 500;

    const errReport = {
      apiError: { ...error },
      apiStatusCode: status,
      message: 'AppInsights connection string route error'
    };
    res.status(status).send(errReport);
  }
}

export const router = Router({ mergeParams: true });

router.get('/', handleConnectionStringRoute);

export default router;
