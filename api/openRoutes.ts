import { Router } from 'express'
import generateTokenRouter from './tokenGenerator'
import getConfigurationUIRouter from './configurationUI'
import getConfigValue from './configValueRouter'

// TODO: rename from prdRouter
import getappInsightsInstrumentationKey from './monitoring-tools'
import prdRouter from './register-org'

// TODO: Not sure if this is needed
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const router = Router({ mergeParams: true })

// So these routes may need the S2S token
// The S2S token is used for hitting an endpoint
// any endpoint should be able to be created and then
// we need to use the S2S token for this.
/**
 * Route: /open/decisions
 *
 * @see local.ts / server.ts
 */
router.use('/register-org', prdRouter)
router.use('/monitoring-tools', getappInsightsInstrumentationKey)
router.use('/generateToken', generateTokenRouter)

// TODO: Discuss which method we use across all projects to send the
// Node configuration to the UI.
router.use('/configuration', getConfigValue)
router.use('/configuration-ui', getConfigurationUIRouter)

export default router
