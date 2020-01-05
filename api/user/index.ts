import * as express from 'express'
import * as log4jui from '../lib/log4jui'
const logger = log4jui.getLogger('auth')
import { UserProfileModel } from './user'
import * as jwtDecode from 'jwt-decode'

export const router = express.Router({ mergeParams: true })

router.get('/details', handleUserRoute)

function handleUserRoute(req, res) {
  // todo get this from config
  /* Time out for user less then 8hrs */
  const timeOuts = {
    caseworker: 5 * 60 * 1000,  // 8 hr
    solicitors: 60 * 60 * 1000, // 1 hr
    special: 20 * 60 * 1000 // 20 min
  };
  const userRoles = req.session.auth.roles

  function getUserTimeouts() {
    if (userRoles.indexOf('caseworker') !== -1) {
      return timeOuts['caseworker']
    }
  }

  const sessionTimeOut = getUserTimeouts()
  // const sessionTimeStamp = jwtDecode(req.session.auth.token).exp
  const now = new Date();
  /* Session timeout */
  const sessionTimeStamp = now.setMinutes(now.getMinutes() + 1)
  const UserDetails: UserProfileModel = {
    email: req.session.auth.email,
    orgId: req.session.auth.orgId,
    roles: req.session.auth.roles,
    sessionTimeOut,
    sessionTimeStamp,
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
