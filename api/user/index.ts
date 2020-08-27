import * as express from 'express'
import * as log4jui from '../lib/log4jui'
const logger = log4jui.getLogger('auth')
export const router = express.Router({ mergeParams: true })
import { UserProfileModel } from './user'

router.get('/details', handleUserRoute)

function handleUserRoute(req, res) {

  console.log('req.session.auth => ', req.session.auth)

  const {email, orgId, roles, userId} = req.session.auth

  const userDetails: UserProfileModel = {
    email,
    orgId,
    roles,
    userId
  }

  try {
      console.log(userDetails)
      res.send(userDetails)
  } catch (error) {
      logger.info(error)
      const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: '' })
      res.status(500).send(errReport)
  }
}

export default router
