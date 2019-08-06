import * as express from 'express'
import stateRouter from './states'

// TODO: Not sure if this is needed
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const router = express.Router({ mergeParams: true })

/**
 * Route: /open/decisions
 *
 * @see local.ts / server.ts
 */
router.use('/decisions', stateRouter)

export default router
