
import * as express from 'express'
import * as auth from './auth'
import stateRouter from './states'

const router = express.Router({ mergeParams: true })

router.use('/decisions', stateRouter)
router.use('/logout', auth.logout)

export default router
