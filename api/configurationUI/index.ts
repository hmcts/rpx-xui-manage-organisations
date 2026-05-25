import { Router } from 'express';

import { getConfigValue, showFeature } from '../configuration';
import {
  FEATURE_TERMS_AND_CONDITIONS_ENABLED,
  GOOGLE_ANALYTICS_KEY,
  LAUNCH_DARKLY_CLIENT_ID,
  LINKS_MANAGE_CASES_LINK,
  LINKS_MANAGE_ORG_LINK,
  PROTOCOL,
  SERVICES_IDAM_WEB,
  SERVICES_TERMS_AND_CONDITIONS_API_PATH
} from '../configuration/references';

export const router = Router({ mergeParams: true });

router.get('/', configurationUIRoute);

/**
 * All the following environmental variables are passed to the UI.
 */
export async function configurationUIRoute(req, res): Promise<void> {
  const environment = getRuntimeEnvironment();
  const launchDarklyClientId = getConfigValue(LAUNCH_DARKLY_CLIENT_ID);
  res.status(200).send({
    environment,
    googleAnalyticsKey: getConfigValue(GOOGLE_ANALYTICS_KEY),
    idamWeb: getConfigValue(SERVICES_IDAM_WEB),
    launchDarklyClientId,
    manageCaseLink: getConfigValue(LINKS_MANAGE_CASES_LINK),
    manageOrgLink: getConfigValue(LINKS_MANAGE_ORG_LINK),
    protocol: getConfigValue(PROTOCOL),
    servicesTandCPath: getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH),
    termsAndConditionsEnabled: showFeature(FEATURE_TERMS_AND_CONDITIONS_ENABLED)
  });
}

export default router;

function getRuntimeEnvironment(): string {
  if (process && process.env && process.env.PREVIEW_DEPLOYMENT_ID) {
    return 'preview';
  }

  return process && process.env && process.env.PUI_ENV ? process.env.PUI_ENV : 'LOCAL';
}
