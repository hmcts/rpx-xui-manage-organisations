import { xuiNode } from '@hmcts/rpx-xui-node-lib';
import { Router } from 'express';
import accountsRouter from './accounts';
import getAllUserList from './allUserList';
import getAllUserListWithoutRoles from './allUserListWithoutRoles';
import { router as caaCaseTypesRouter } from './caaCaseTypes';
import { router as caaCasesRouter } from './caaCases';
import { router as caseShareRouter } from './caseshare/routes';
import { showFeature } from './configuration';
import editUserPermissions from './editUserPermissions';
import getUserTermsAndConditions from './getUserTermsAndConditions';
import healthCheck from './healthCheck';
import inviteUser from './inviteUser';
import getJurisdictions from './jurisdictions';
import authInterceptor from './lib/middleware/auth';
import organisationRouter from './organisation';
import payments from './payments';
import { router as pbaRouter } from './pbas/routes';
import postUserTermsAndConditions from './postUserTermsAndConditions';
import { router as registerRouter } from './register-org';
import suspendUser from './suspendUser';
import getTermsAndConditions from './termsAndConditions';
import userDetailsRouter from './user';
import getUserDetails from './user-details';
import getUserList from './userList';
import refreshUser from './refresh-user';
import retriveAccessTypes from './retrieveAccessTypes';
import ogdInvite from './ogd';

const router = Router({ mergeParams: true });

router.use('/healthCheck', healthCheck);

router.get('/configuration', (req, res) => {
  res.send(showFeature(req.query.configurationKey as string));
});

router.use(authInterceptor);

router.use(xuiNode.authenticate);
router.use('/organisation', organisationRouter);
router.use('/accounts', accountsRouter);
router.use('/user', userDetailsRouter);
router.use('/healthCheck', healthCheck);
router.use('/inviteUser', inviteUser);
router.use('/refresh-user', refreshUser);
router.use('/allUserList', getAllUserList);
router.use('/allUserListWithoutRoles', getAllUserListWithoutRoles);
router.use('/userList', getUserList);
router.use('/userDetails', getUserList);
router.use('/jurisdictions', getJurisdictions);
router.use('/payments/:account', payments);
router.use('/userTermsAndConditions/:userId', getUserTermsAndConditions);
router.use('/userTermsAndConditions', postUserTermsAndConditions);
router.use('/termsAndConditions', getTermsAndConditions);
router.use('/user/:userId/suspend', suspendUser);
router.use('/editUserPermissions/users/:userId', editUserPermissions);
router.use('/caaCases', caaCasesRouter);
router.use('/caaCaseTypes', caaCaseTypesRouter);
router.use('/caseshare', caseShareRouter);
router.use('/pba', pbaRouter);
router.use('/register-org', registerRouter);
router.use('/user-details', getUserDetails);
router.use('/retrieve-access-types', retriveAccessTypes);
router.use('/ogd-flow', ogdInvite);
export default router;
