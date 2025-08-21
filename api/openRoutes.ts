import { Router } from 'express';
import getConfigurationUIRouter from './configurationUI';
import getConfigValue from './configValueRouter';

import getRegulatoryOrganisationTypesRouter from './organisationTypesRouter';
import getLovRefDataRouter from './prd/lov';

// TODO: rename from prdRouter
import getAppInsightsConnectionString from './monitoring-tools';
import prdRouter from './register-org';
import registerOrgRouter from './registerOrganisation';
import addressRouter from './addresses';

// TODO: Not sure if this is needed
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const router = Router({ mergeParams: true });

// So these routes may need the S2S token
// The S2S token is used for hitting an endpoint
// any endpoint should be able to be created and then
// we need to use the S2S token for this.
/**
 * Route: /open/decisions
 *
 * @see local.ts / server.ts
 */
router.use('/register-org', prdRouter);
router.use('/register-org-new', registerOrgRouter);
router.use('/monitoring-tools', getAppInsightsConnectionString);
router.use('/addresses', addressRouter);

// TODO: Discuss which method we use across all projects to send the
// Node configuration to the UI.
router.use('/configuration', getConfigValue);
router.use('/configuration-ui', getConfigurationUIRouter);

router.use('/getLovRefData', getLovRefDataRouter);
router.use('/regulatoryOrganisationTypes', getRegulatoryOrganisationTypesRouter);

export default router;
