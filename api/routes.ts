import * as express from 'express'
import accountsRouter from './accounts'
import * as auth from './auth'
import userDetailsRouter from './user'
import inviteUser from './inviteUser'
import organisationRouter from './organisation'
import getUserList from './userList'
import stateRouter from './states'

const router = express.Router({ mergeParams: true })

/**
 * Here it looks like we are attaching the s2s token to each of the /api routes, so that whenever an api
 * route is called we get the s2s token and use it????
 */
router.use(auth.attach) // attach user-profile to all api routes

router.use('/logout', (req, res, next) => {
    auth.doLogout(req, res)
})
router.use('/decisions', stateRouter)
router.use('/organisation', organisationRouter)
router.use('/accounts', accountsRouter)
router.use('/user', userDetailsRouter)
router.use('/inviteUser', inviteUser)
router.use('/userList', getUserList)
router.use('/userDetails', getUserList)
router.use('/health', (req, res, next) => {
  res.send('Manage Organisations running.')
})

export default router
