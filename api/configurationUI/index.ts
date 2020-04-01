import * as express from 'express'
import { getConfigValue } from '../configuration'
import { GOOGLE_ANALYTICS_KEY, LAUNCH_DARKLY_CLIENT_ID, PROTOCOL, SERVICES_IDAM_WEB } from '../configuration/references'

export const router = express.Router({mergeParams: true})

router.get('/', configurationUIRoute)

/**
 * All the following environmental variables are passed to the UI.
 */
async function configurationUIRoute(req, res) {
  res.status(200).send({
    googleAnalyticsKey: getConfigValue(GOOGLE_ANALYTICS_KEY),
    idamWeb: getConfigValue(SERVICES_IDAM_WEB),
    launchDarklyClientId: getConfigValue(LAUNCH_DARKLY_CLIENT_ID),
    protocol: getConfigValue(PROTOCOL),
  })
}

export default router
