import * as express from 'express'
import stateRouter from './states'

const router = express.Router({ mergeParams: true })

router.use('/decisions', stateRouter)

export default router
