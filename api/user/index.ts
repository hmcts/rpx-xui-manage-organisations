import { getUserSessionTimeout } from '@hmcts/rpx-xui-node-lib';
import * as express from 'express';

import { getConfigValue } from '../configuration';
import { SESSION_TIMEOUTS } from '../configuration/references';
import * as log4jui from '../lib/log4jui';
import { exists, objectContainsOnlySafeCharacters } from '../lib/util';
import { UserProfileModel } from './user';

const logger = log4jui.getLogger('auth');
export const router = express.Router({ mergeParams: true });
router.get('/details', handleUserRoute);

function handleUserRoute(req, res) {
  const { email, orgId, roles, userId } = req.session.auth;
  const sessionTimeouts = getConfigValue(SESSION_TIMEOUTS);
  const sessionTimeout = getUserSessionTimeout(roles, sessionTimeouts);

  const userDetails: UserProfileModel = {
    email,
    orgId,
    roles,
    sessionTimeout,
    userId
  };

  try {
    console.log(userDetails);
    if (!objectContainsOnlySafeCharacters(userDetails)) {
      return res.send('Invalid user data').status(400);
    }
    res.send(userDetails);
  } catch (error) {
    logger.info(error);
    const errReport = {
      apiError: error,
      apiStatusCode: exists(error, 'statusCode'),
      message: ''
    };
    res.status(500).send(errReport);
  }
}

export default router;
