
import * as express from 'express'
import * as auth from './auth'
import accountsRouter from './accounts'
import organisationRouter from './organisation'

const router = express.Router({ mergeParams: true });

router.use('/logout', auth.logout)
router.use('/organisation', organisationRouter)
router.use('/accounts', accountsRouter)
export default router
