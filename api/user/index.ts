import * as express from 'express'
import * as log4jui from '../lib/log4jui'
const logger = log4jui.getLogger('auth')
export const router = express.Router({ mergeParams: true })
import { UserProfileModel } from './user'
import {exists} from "../lib/util";

router.get('/details', handleUserRoute)

function handleUserRoute(req, res) {

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
      const errReport = {
        apiError: error,
        apiStatusCode: exists(error, 'statusCode'),
        message: ''
      }
      res.status(500).send(errReport)
  }
}

export default router
