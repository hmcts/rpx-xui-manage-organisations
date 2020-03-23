import * as express from 'express'
import {getConfigValue} from '../configuration'
import {
  LINKS_MANAGE_CASES_LINK, LINKS_MANAGE_ORG_LINK, SERVICES_IDAM_WEB,
} from '../configuration/references'

export const router = express.Router({mergeParams: true})

router.get('/', configurationUIRoute)

/**
 * All the following environmental variables are passed to the UI.
 */
async function configurationUIRoute(req, res) {
  res.status(200).send({
    idamWeb: getConfigValue(SERVICES_IDAM_WEB),
    manageCaseLink: getConfigValue(LINKS_MANAGE_CASES_LINK),
    manageOrgLink: getConfigValue(LINKS_MANAGE_ORG_LINK),
  })
}

export default router
