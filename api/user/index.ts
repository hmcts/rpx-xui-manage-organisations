import * as express from 'express'
import * as log4jui from '../lib/log4jui'
const logger = log4jui.getLogger('auth')
export const router = express.Router({ mergeParams: true })
import { UserProfileModel } from './user'
import { getUserSessionTimeout } from './userTimeout';

router.get('/details', handleUserRoute)

function handleUserRoute(req, res) {

  const { email, orgId, roles, userId } = req.session.auth

  const roleGroupSessionTimeouts = [
    {
      idleModalDisplayTime: 6,
      pattern: 'pui-',
      totalIdleTime: 55,
    },
    {
      idleModalDisplayTime: 3,
      pattern: 'caseworker',
      totalIdleTime: 30,
    },
    {
      idleModalDisplayTime: 6,
      pattern: '.',
      totalIdleTime: 60,
    },
    // {
    //   idleModalDisplayTime: 6,
    //   pattern: 'asdasdasd',
    //   totalIdleTime: 60,
    // },
  ]

  console.log('roles')
  console.log(roles)
  console.log(roles.sort())

  const userSessionTimeout = getUserSessionTimeout(roles, roleGroupSessionTimeouts)

  const UserDetails: UserProfileModel = {
    email,
    orgId,
    roles,
    sessionTimeout: userSessionTimeout,
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
