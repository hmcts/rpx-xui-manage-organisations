import * as express from 'express'
import * as log4jui from '../lib/log4jui'
const logger = log4jui.getLogger('auth')
export const router = express.Router({ mergeParams: true })
import { UserProfileModel } from './user'

router.get('/details', handleUserRoute)
router.get('/simple', handleSimpleRoute)
router.get('/onUserRoute', handleSimpleRoute)

function handleUserRoute(req, res) {

  // const UserDetails: UserProfileModel = {
  //   email: 'hardcoded@user.com',
  //   orgId: '12345',
  //   roles: ['pui-case-manager', 'pui-user-manager', 'pui-finance-manager' , 'pui-organisation-manager'],
  //   userId: '1'
  // }

  // newly added. Works on local, but doesn't work on AAT.
  // on AAT
  // it returns the wrong content type.
  // returns html.
  const UserDetails: UserProfileModel = {
    email: req.session.auth.email,
    orgId: req.session.auth.orgId,
    roles: req.session.auth.roles,
    userId: req.session.auth.userId
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

function handleSimpleRoute(req, res) {
  console.log('Simple route hit')
  res.send({ hello: 'world' })
}

export default router
