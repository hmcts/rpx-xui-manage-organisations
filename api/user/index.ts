import * as express from 'express'
import * as log4jui from '../lib/log4jui'
const logger = log4jui.getLogger('auth')
export const router = express.Router({ mergeParams: true })
import { UserProfileModel } from './user'
import { getUserSessionTimeout } from './userTimeout';

router.get('/details', handleUserRoute)

// Setup timeouts for the application
// {
//   role: '*DwP', // takes in regEx so you can set this to be DwPensions.
//     idleTime: 43200// idle time in seconds
// },
// default
// {
//   role: '*', // takes in regEx so you can set this to be DwPensions.
//     idleTime: 180000// idle time in seconds
//}

// So what we need to do here is get the timeouts
// and then run these by the users role.
// ok so the roles come in here,
// let's get the usertimeout configuration here and pass it through to the timeoutCalcService
function handleUserRoute(req, res) {

  const { email, orgId, roles, userId } = req.session.auth

  const roleGroupSessionTimeouts = [
    {
      idleTime: 43200, // idle time in seconds
      role: '*DwP', // takes in regEx so you can set this to be DwPensions.
    },
    {
      idleTime: 180000, // idle time in seconds
      role: '*', // takes in regEx so you can set this to be DwPensions.
    },
  ]

  const sessionTimeout = getUserSessionTimeout(roles, roleGroupSessionTimeouts)

  const UserDetails: UserProfileModel = {
    email,
    orgId,
    roles,
    sessionTimeout: {
      idleModalDisplayTime: 5000,
      totalIdleTime: 15000,
    },
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
