import * as express from 'express'
import * as log4jui from '../lib/log4jui'
const logger = log4jui.getLogger('auth')
import { UserProfileModel } from './user'

export const router = express.Router({ mergeParams: true })

router.get('/details', handleUserRoute)

function handleUserRoute(req, res) {
  // todo get this from config
  const timeOuts = {
    caseworker: 2 * 60 * 1000,  // 8 hr
    solicitors: 60 * 60 * 1000, // 1 hr
    special: 20 * 60 * 1000 // 20 min
  };
  const userRoles = req.session.auth.roles;

  function getUserTimeouts() {
    if (userRoles.indexOf('caseworker') !== -1) {
      return timeOuts['caseworker']
    }
  }

  const sessionTimeOut = getUserTimeouts()

  const UserDetails: UserProfileModel = {
    email: req.session.auth.email,
    orgId: req.session.auth.orgId,
    roles: req.session.auth.roles,
    sessionTimeOut,
    userId: req.session.auth.userId
  };

  try {
      const payload = JSON.stringify(UserDetails);
      console.log(payload)
      res.send(payload)
  } catch (error) {
      // there is bug here
      logger.info(error)
      const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: '' })
      res.status(500).send(errReport)
  }
}

export default router
