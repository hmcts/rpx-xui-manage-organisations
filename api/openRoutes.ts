import * as express from 'express'
import stateRouter from './states'

// TODO: Not sure if this is needed
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const router = express.Router({ mergeParams: true })

// So these routes may need the S2S token
// The S2S token is used for hitting an endpoint
// any endpoint should be able to be created and then
// we need to use the S2S token for this.
/**
 * Route: /open/decisions
 *
 * @see local.ts / server.ts
 */
router.use('/decisions', stateRouter)

export default router
