
import * as express from 'express'
import * as auth from './auth'
import accountsRouter from './accounts'

const router = express.Router({ mergeParams: true });

router.use('/logout', auth.logout)
router.use('/account-fee', accountsRouter)
export default router
