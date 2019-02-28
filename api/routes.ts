
import * as express from 'express'
import accountsRouter from './accounts'
import * as auth from './auth'
import inviteUser from './inviteUser'
import organisationRouter from './organisation'

const router = express.Router({ mergeParams: true })

router.use('/logout', auth.logout)
router.use('/organisation', organisationRouter)
router.use('/accounts', accountsRouter)
router.use('/inviteUser', inviteUser)

export default router
