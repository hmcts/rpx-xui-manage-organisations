import { Request, Response, Router } from 'express';
import { compareAccessTypes } from '../retrieveAccessTypes';
import { inviteUserRouteOGD } from '../inviteUser';
import { ogdEditUserRoute } from '../editUserPermissions';
import { refreshUser } from '../refresh-user';
import * as log4jui from '../lib/log4jui';

export const router = Router({ mergeParams: true });
const logger = log4jui.getLogger('OGD-FLOW');

export async function ogdInvite(req: Request, res: Response) {
  try {
    logger.info('ogdInvite:: Invite Request received');
    const userPayload = req.body.userPayload;
    if (userPayload.roles.includes('pui-caa')) {
      const compareResult = await compareAccessTypes(req);
      req.body.userPayload = { ...userPayload, ...compareResult };
    }
    const operationResult = await inviteUserRouteOGD(req);
    const userId = operationResult.userIdentifier;
    req.body = { userId };
    await refreshUser(req);
    res.send(operationResult);
  } catch (error) {
    logger.error('ogdInvite:: Error ', error);
    res.status(error.apiStatusCode || 500).json(error);
  }
}

export async function ogdUpdate(req: Request, res: Response) {
  try {
    logger.info('ogdUpdate:: Edit User Request received');
    const userPayload = req.body.userPayload;
    const userId = req.params.userId;
    const compareResult = await compareAccessTypes(req);
    req.body = { ...userPayload, ...compareResult };
    const operationResult = await ogdEditUserRoute(req);
    req.body = { userId };
    await refreshUser(req);
    res.send(operationResult);
  } catch (error) {
    logger.error('ogdUpdate:: Error ', error);
    res.status(error.apiStatusCode || 500).json(error);
  }
}

router.post('/invite', ogdInvite);
router.put('/update/:userId', ogdUpdate);

export default router;
