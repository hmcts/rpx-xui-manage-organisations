import * as express from 'express'
import * as log4jui from '../lib/log4jui'
const logger = log4jui.getLogger('auth')
export const router = express.Router({ mergeParams: true })
import { UserMock } from './user.mock'
import { UserProfileModel } from './user'

router.get('/details', handleUserRoute)

async function handleUserRoute(req, res) {
    logger.info('orgId', req.session.auth.orgId)
    logger.info('userId', req.session.auth.userId)
    logger.info('email', req.session.auth.email)
    logger.info('email', req.session.auth.roles)

    const UserDetails: UserProfileModel = new UserProfileModel({
      email: req.session.auth.email,
      roles: req.session.auth.roles,
      userId: req.session.auth.userId,
    })

    try {
        res.send(UserDetails)
    } catch (error) {
        logger.info(error)
        res.status(500).send(error)
    }
}

export default router
