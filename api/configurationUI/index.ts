import { Router } from 'express'
import { getConfigValue } from '../configuration'
import {
  GOOGLE_ANALYTICS_KEY,
  LAUNCH_DARKLY_CLIENT_ID,
  LINKS_MANAGE_CASES_LINK,
  LINKS_MANAGE_ORG_LINK,
  PROTOCOL,
  SERVICES_IDAM_WEB
} from '../configuration/references'

export const router = Router({ mergeParams: true })

router.get('/', configurationUIRoute)

/**
 * All the following environmental variables are passed to the UI.
 */
export async function configurationUIRoute(req, res) {
  res.status(200).send({
    googleAnalyticsKey: getConfigValue(GOOGLE_ANALYTICS_KEY),
    idamWeb: getConfigValue(SERVICES_IDAM_WEB),
    launchDarklyClientId: getConfigValue(LAUNCH_DARKLY_CLIENT_ID),
    manageCaseLink: getConfigValue(LINKS_MANAGE_CASES_LINK),
    manageOrgLink: getConfigValue(LINKS_MANAGE_ORG_LINK),
    protocol: getConfigValue(PROTOCOL),
  })
}

export default router
