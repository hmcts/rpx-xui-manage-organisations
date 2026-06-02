import { Router } from 'express';

import { getConfigValue, showFeature } from '../configuration';
import {
  FEATURE_OGD_UPDATE_REFRESH_USER_ENABLED,
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

const DEPLOYMENT_ENVIRONMENTS = ['aat', 'demo', 'perftest', 'ithc', 'prod'];

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
    ogdUpdateRefreshUserEnabled: showFeature(FEATURE_OGD_UPDATE_REFRESH_USER_ENABLED),
    protocol: getConfigValue(PROTOCOL),
    servicesTandCPath: getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH),
    termsAndConditionsEnabled: showFeature(FEATURE_TERMS_AND_CONDITIONS_ENABLED)
  });
}

export default router;

function getRuntimeEnvironment(): string {
  const previewDeploymentId = process && process.env && process.env.PREVIEW_DEPLOYMENT_ID;
  const puiEnv = process && process.env && process.env.PUI_ENV;
  const idamWeb = getConfigValue(SERVICES_IDAM_WEB);

  if (previewDeploymentId) {
    return 'preview';
  }

  const deploymentEnvironment = getEnvironmentFromDeploymentUrl(idamWeb);
  if (deploymentEnvironment) {
    return deploymentEnvironment;
  }

  return puiEnv || 'LOCAL';
}

function getEnvironmentFromDeploymentUrl(url?: string): string | null {
  if (!url) {
    return null;
  }

  const lowerCaseUrl = url.toLowerCase();
  if (lowerCaseUrl.includes('hmcts-access.service.gov.uk')) {
    return 'prod';
  }

  const environment = DEPLOYMENT_ENVIRONMENTS.find((deploymentEnvironment) =>
    lowerCaseUrl.includes(`.${deploymentEnvironment}.`) ||
    lowerCaseUrl.includes(`-${deploymentEnvironment}.`)
  );

  return environment || null;
}
