import { AxiosResponse } from 'axios';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as configuration from '../configuration';
import {
  FEATURE_OGD_UPDATE_REFRESH_USER_ENABLED,
  SERVICES_CCD_DEFINITION_STORE_API_PATH,
  SERVICES_RD_PROFESSIONAL_API_PATH,
  SERVICES_ROLE_ASSIGNMENT_MAPPING_API_PATH
} from '../configuration/references';
import * as refdataUserCommonUrlUtil from '../refdataUserCommonUrlUtil';
import { ogdInvite, ogdUpdate } from './index';

describe('ogd index', () => {
  let req: any;
  let res: any;
  let postStub: sinon.SinonStub;
  let putStub: sinon.SinonStub;

  const configValues = {
    [SERVICES_CCD_DEFINITION_STORE_API_PATH]: 'ccd-definition-api',
    [SERVICES_RD_PROFESSIONAL_API_PATH]: 'rd-professional-api',
    [SERVICES_ROLE_ASSIGNMENT_MAPPING_API_PATH]: 'role-assignment-api'
  };

  const accessTypesResponse = {
    jurisdictions: [
      {
        jurisdictionId: 'CIVIL',
        accessTypes: [
          {
            accessTypeId: 'CIVIL_STANDARD',
            accessDefault: false,
            accessMandatory: false,
            display: true,
            organisationProfileId: 'SOLICITOR_PROFILE'
          },
          {
            accessTypeId: 'CIVIL_FINANCE',
            accessDefault: false,
            accessMandatory: false,
            display: true,
            organisationProfileId: 'SOLICITOR_PROFILE'
          }
        ]
      }
    ]
  };

  const userAccessTypes = [
    {
      accessTypeId: 'CIVIL_STANDARD',
      enabled: true,
      jurisdictionId: 'CIVIL',
      organisationProfileId: 'SOLICITOR_PROFILE'
    },
    {
      accessTypeId: 'CIVIL_FINANCE',
      enabled: false,
      jurisdictionId: 'CIVIL',
      organisationProfileId: 'SOLICITOR_PROFILE'
    }
  ];

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    postStub = sinon.stub();
    putStub = sinon.stub();
    req.body = {};
    req.params = {};
    req.http = {
      post: postStub,
      put: putStub
    };
    sinon.stub(configuration, 'getConfigValue').callsFake((key: string) => configValues[key]);
    sinon.stub(configuration, 'showFeature').returns(true);
    sinon.stub(refdataUserCommonUrlUtil, 'getRefdataUserCommonUrlUtil').returns('rd-common-users-api');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('compares access types, invites the user, and refreshes only after invite success', async () => {
    req.body = {
      orgIdsPayload: ['SOLICITOR_PROFILE'],
      userPayload: {
        email: 'casey.invite@example.com',
        firstName: 'Casey',
        lastName: 'Invite',
        resendInvite: false,
        roles: ['pui-case-manager'],
        userAccessTypes
      }
    };
    postStub.onCall(0).resolves({ data: accessTypesResponse } as AxiosResponse);
    postStub.onCall(1).resolves({ data: { userIdentifier: 'new-user-id' } } as AxiosResponse);
    postStub.onCall(2).resolves({ data: { refreshed: true } } as AxiosResponse);

    await ogdInvite(req, res);

    sinon.assert.calledWith(postStub.firstCall, 'ccd-definition-api/retrieve-access-types', {
      organisationProfileIds: ['SOLICITOR_PROFILE']
    });
    sinon.assert.calledWith(postStub.secondCall, 'rd-common-users-api', {
      email: 'casey.invite@example.com',
      firstName: 'Casey',
      lastName: 'Invite',
      resendInvite: false,
      roles: ['pui-case-manager'],
      userAccessTypes
    });
    sinon.assert.calledWith(postStub.thirdCall, 'role-assignment-api/am/role-mapping/professional/refresh?userId=new-user-id');
    sinon.assert.calledWith(configuration.showFeature as sinon.SinonStub, FEATURE_OGD_UPDATE_REFRESH_USER_ENABLED);
    sinon.assert.calledWith(res.send, { userIdentifier: 'new-user-id' });
  });

  it('compares access types, updates the user, and refreshes with the route user ID after update success', async () => {
    req.params = { userId: 'active-user-id' };
    req.body = {
      orgIdsPayload: ['SOLICITOR_PROFILE'],
      userPayload: {
        email: 'avery.active@example.com',
        firstName: 'Avery',
        id: 'stale-body-user-id',
        idamStatus: 'ACTIVE',
        lastName: 'Active',
        rolesAdd: [{ name: 'pui-case-manager' }],
        rolesDelete: [{ name: 'pui-user-manager' }],
        userAccessTypes
      }
    };
    postStub.onCall(0).resolves({ data: accessTypesResponse } as AxiosResponse);
    putStub.resolves({ data: { roleAdditionResponse: { idamStatusCode: '201' } } } as AxiosResponse);
    postStub.onCall(1).resolves({ data: { refreshed: true } } as AxiosResponse);

    await ogdUpdate(req, res);

    sinon.assert.calledWith(postStub.firstCall, 'ccd-definition-api/retrieve-access-types', {
      organisationProfileIds: ['SOLICITOR_PROFILE']
    });
    sinon.assert.calledWith(
      putStub,
      'rd-professional-api/refdata/external/v1/organisations/users/active-user-id',
      {
        email: 'avery.active@example.com',
        firstName: 'Avery',
        id: 'stale-body-user-id',
        idamStatus: 'ACTIVE',
        lastName: 'Active',
        rolesAdd: [{ name: 'pui-case-manager' }],
        rolesDelete: [{ name: 'pui-user-manager' }],
        userAccessTypes
      }
    );
    sinon.assert.calledWith(postStub.secondCall, 'role-assignment-api/am/role-mapping/professional/refresh?userId=active-user-id');
    sinon.assert.calledWith(res.send, { roleAdditionResponse: { idamStatusCode: '201' } });
  });

  it('does not invite, update, or refresh when compare-access-types fails', async () => {
    req.body = {
      orgIdsPayload: ['SOLICITOR_PROFILE'],
      userPayload: {
        roles: ['pui-case-manager'],
        userAccessTypes
      }
    };
    postStub.rejects({
      data: {
        errorDescription: 'CCD access types unavailable',
        errorMessage: 'Service unavailable'
      },
      status: 503
    });

    await ogdInvite(req, res);

    sinon.assert.calledOnceWithExactly(postStub, 'ccd-definition-api/retrieve-access-types', {
      organisationProfileIds: ['SOLICITOR_PROFILE']
    });
    sinon.assert.notCalled(putStub);
    sinon.assert.calledWith(res.status, 503);
    sinon.assert.calledWith(res.json, {
      apiError: 'Service unavailable',
      apiStatusCode: 503,
      message: 'CCD access types unavailable'
    });
    sinon.assert.notCalled(res.send);
  });

  it('does not refresh when invite fails', async () => {
    req.body = {
      userPayload: {
        email: 'casey.invite@example.com',
        firstName: 'Casey',
        lastName: 'Invite',
        resendInvite: false,
        roles: ['pui-user-manager']
      }
    };
    postStub.rejects({
      data: {
        errorDescription: 'RD invite rejected',
        errorMessage: 'Invite rejected'
      },
      status: 422
    });

    await ogdInvite(req, res);

    sinon.assert.calledOnceWithExactly(postStub, 'rd-common-users-api', req.body.userPayload);
    sinon.assert.calledWith(res.status, 422);
    sinon.assert.calledWith(res.json, {
      apiError: 'Invite rejected',
      apiStatusCode: 422,
      message: 'RD invite rejected'
    });
    sinon.assert.notCalled(res.send);
  });

  it('does not return success when refresh-user fails after an invite', async () => {
    req.body = {
      userPayload: {
        email: 'casey.invite@example.com',
        firstName: 'Casey',
        lastName: 'Invite',
        resendInvite: false,
        roles: ['pui-user-manager']
      }
    };
    postStub.onCall(0).resolves({ data: { userIdentifier: 'new-user-id' } } as AxiosResponse);
    postStub.onCall(1).rejects({
      data: {
        errorDescription: 'Refresh unavailable',
        errorMessage: 'Refresh failed'
      },
      status: 502
    });

    await ogdInvite(req, res);

    sinon.assert.calledWith(postStub.firstCall, 'rd-common-users-api', {
      email: 'casey.invite@example.com',
      firstName: 'Casey',
      lastName: 'Invite',
      resendInvite: false,
      roles: ['pui-user-manager']
    });
    sinon.assert.calledWith(postStub.secondCall, 'role-assignment-api/am/role-mapping/professional/refresh?userId=new-user-id');
    sinon.assert.calledWith(res.status, 502);
    sinon.assert.calledWith(res.json, {
      apiError: 'Refresh failed',
      apiStatusCode: 502,
      message: 'Refresh unavailable'
    });
    sinon.assert.notCalled(res.send);
  });
});
