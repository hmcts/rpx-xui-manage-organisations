import * as express from 'express'
import * as log4jui from '../lib/log4jui'
const logger = log4jui.getLogger('auth')
export const router = express.Router({ mergeParams: true })
import { UserProfileModel } from './user'
import { getUserSessionTimeout } from './userTimeout';
import { getConfigValue } from '../configuration'
import { SESSION_TIMEOUTS } from '../configuration/references'

router.get('/details', handleUserRoute)

function handleUserRoute(req, res) {

  const { email, orgId, roles, userId } = req.session.auth

  const sessionTimeouts = getConfigValue(SESSION_TIMEOUTS)
  const sessionTimeout = getUserSessionTimeout(roles, sessionTimeouts)

  const UserDetails: UserProfileModel = {
    email,
    orgId,
    roles,
    sessionTimeout,
    userId,
  }

  try {
      const payload = JSON.stringify(UserDetails);
      console.log(payload)
      res.send(payload)
  } catch (error) {
      logger.info(error)
      const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: '' })
      res.status(500).send(errReport)
  }
}

export default router
