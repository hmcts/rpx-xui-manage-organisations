import * as express from 'express'
import * as log4jui from '../lib/log4jui'
const logger = log4jui.getLogger('auth')
export const router = express.Router({ mergeParams: true })
import { UserProfileModel } from './user'

router.get('/details', handleUserRoute)

async function handleUserRoute(req, res) {
    const UserDetails: UserProfileModel = new UserProfileModel({
      email: req.session.auth.email,
      orgId: req.session.auth.orgId,
      roles: req.session.auth.roles,
      userId: req.session.auth.userId
    })

    try {
        res.send(UserDetails)
    } catch (error) {
        logger.info(error)
        const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: '' })
        res.status(500).send(errReport)
    }
}

export default router
