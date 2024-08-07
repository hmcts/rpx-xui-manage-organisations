import { Router } from 'express';

import { getConfigValue } from '../configuration';
import {
  GOOGLE_ANALYTICS_KEY,
  LAUNCH_DARKLY_CLIENT_ID,
  LINKS_MANAGE_CASES_LINK,
  LINKS_MANAGE_ORG_LINK,
  PROTOCOL,
  SERVICE_S2S_PATH,
  SERVICES_FEE_AND_PAY_API_PATH,
  SERVICES_IDAM_API_PATH,
  SERVICES_IDAM_WEB,
  SERVICES_RD_PROFESSIONAL_API_PATH,
  SERVICES_TERMS_AND_CONDITIONS_API_PATH
} from '../configuration/references';

export const router = Router({ mergeParams: true });

router.get('/', configurationUIRoute);

/**
 * All the following environmental variables are passed to the UI.
 */
export async function configurationUIRoute(req, res): Promise<void> {
  const environment = process && process.env && process.env.PUI_ENV;
  const launchDarklyClientId = getConfigValue(LAUNCH_DARKLY_CLIENT_ID);
  res.status(200).send({
    feeAndPayApiPath: getConfigValue(SERVICES_FEE_AND_PAY_API_PATH),
    googleAnalyticsKey: getConfigValue(GOOGLE_ANALYTICS_KEY),
    idamWeb: getConfigValue(SERVICES_IDAM_WEB),
    launchDarklyClientId,
    manageCaseLink: getConfigValue(LINKS_MANAGE_CASES_LINK),
    manageOrgLink: getConfigValue(LINKS_MANAGE_ORG_LINK),
    protocol: getConfigValue(PROTOCOL),
    rdProfessionalApiPath: getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH),
    s2sPath: getConfigValue(SERVICE_S2S_PATH),
    servicesIdamApiPath: getConfigValue(SERVICES_IDAM_API_PATH),
    servicesTandCPath: getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH),
    envrionment: environment ? environment : 'LOCAL'
  });
}

export default router;
