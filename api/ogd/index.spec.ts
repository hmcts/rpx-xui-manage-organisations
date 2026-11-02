import { expect } from 'chai';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as configuration from '../configuration';
import * as editUserPermissions from '../editUserPermissions';
import * as inviteUser from '../inviteUser';
import * as refreshUserModule from '../refresh-user';
import * as retrieveAccessTypes from '../retrieveAccessTypes';
import { ogdInvite, ogdUpdate } from './index';

describe('OGD flow API', () => {
  const invitePayload = {
    email: 'user@example.invalid',
    firstName: 'Example',
    lastName: 'User',
    roles: ['pui-case-manager'],
    userAccessTypes: [{ accessTypeId: 'standard', enabled: true }]
  };
  const comparedAccessTypes = [{ accessTypeId: 'standard', enabled: true }];

  afterEach(() => sinon.restore());

  it('compares access types before inviting a case manager and refreshes the invited user', async () => {
    const req = mockReq({ body: { orgIdsPayload: ['profile-1'], userPayload: { ...invitePayload } } });
    const res = mockRes();
    const compare = sinon.stub(retrieveAccessTypes, 'compareAccessTypes').resolves({ userAccessTypes: comparedAccessTypes });
    let sentPayload;
    const invite = sinon.stub(inviteUser, 'inviteUserRouteOGD').callsFake(async (request) => {
      sentPayload = request.body.userPayload;
      return { userIdentifier: 'invited-user' };
    });
    const refresh = sinon.stub(refreshUserModule, 'refreshUser').resolves({});
    sinon.stub(configuration, 'showFeature').returns(true);

    await ogdInvite(req, res);

    sinon.assert.calledOnceWithExactly(compare, req);
    sinon.assert.calledOnceWithExactly(invite, req);
    expect(sentPayload.userAccessTypes).to.deep.equal(comparedAccessTypes);
    sinon.assert.calledOnceWithExactly(refresh, req);
    expect(refresh.firstCall.args[0].body).to.deep.equal({ userId: 'invited-user' });
    sinon.assert.callOrder(compare, invite, refresh);
    sinon.assert.calledWithExactly(res.send, { userIdentifier: 'invited-user' });
  });

  it('skips comparison for a non-case-manager invite and skips refresh when disabled', async () => {
    const req = mockReq({ body: { userPayload: { ...invitePayload, roles: ['pui-user-manager'] } } });
    const res = mockRes();
    const compare = sinon.stub(retrieveAccessTypes, 'compareAccessTypes');
    const invite = sinon.stub(inviteUser, 'inviteUserRouteOGD').resolves({ userIdentifier: 'invited-user' });
    const refresh = sinon.stub(refreshUserModule, 'refreshUser');
    sinon.stub(configuration, 'showFeature').returns(false);

    await ogdInvite(req, res);

    sinon.assert.notCalled(compare);
    sinon.assert.calledOnce(invite);
    sinon.assert.notCalled(refresh);
    sinon.assert.calledWithExactly(res.send, { userIdentifier: 'invited-user' });
  });

  it('returns the invite service error without refreshing the user', async () => {
    const req = mockReq({ body: { userPayload: { ...invitePayload, roles: [] } } });
    const res = mockRes();
    const error = { apiError: 'Invite failed', apiStatusCode: 409, message: 'User already exists' };
    sinon.stub(inviteUser, 'inviteUserRouteOGD').callsFake(async () => {
      throw error;
    });
    const refresh = sinon.stub(refreshUserModule, 'refreshUser');

    await ogdInvite(req, res);

    sinon.assert.notCalled(refresh);
    sinon.assert.calledWithExactly(res.status, 409);
    sinon.assert.calledWithExactly(res.json, error);
  });

  it('returns a refresh failure after a successful invite', async () => {
    const req = mockReq({ body: { userPayload: { ...invitePayload, roles: [] } } });
    const res = mockRes();
    const error = { apiError: 'Refresh failed', apiStatusCode: 503, message: 'Role mapping unavailable' };
    sinon.stub(inviteUser, 'inviteUserRouteOGD').resolves({ userIdentifier: 'invited-user' });
    sinon.stub(refreshUserModule, 'refreshUser').callsFake(async () => {
      throw error;
    });
    sinon.stub(configuration, 'showFeature').returns(true);

    await ogdInvite(req, res);

    sinon.assert.calledWithExactly(res.status, 503);
    sinon.assert.calledWithExactly(res.json, error);
    sinon.assert.notCalled(res.send);
  });

  it('does not invite a case manager when access type comparison fails', async () => {
    const req = mockReq({ body: { orgIdsPayload: ['profile-1'], userPayload: { ...invitePayload } } });
    const res = mockRes();
    const error = { apiError: 'Service unavailable', apiStatusCode: 503, message: 'CCD unavailable' };
    sinon.stub(retrieveAccessTypes, 'compareAccessTypes').callsFake(async () => {
      throw error;
    });
    const invite = sinon.stub(inviteUser, 'inviteUserRouteOGD');

    await ogdInvite(req, res);

    sinon.assert.notCalled(invite);
    sinon.assert.calledWithExactly(res.status, 503);
    sinon.assert.calledWithExactly(res.json, error);
  });

  it('updates permissions with compared access types and refreshes the target user', async () => {
    const userPayload = { rolesAdd: [], rolesDelete: [], userAccessTypes: [{ accessTypeId: 'standard', enabled: false }] };
    const req = mockReq({ body: { orgIdsPayload: ['profile-1'], userPayload }, params: { userId: 'target-user' } });
    const res = mockRes();
    const compare = sinon.stub(retrieveAccessTypes, 'compareAccessTypes').resolves({ userAccessTypes: comparedAccessTypes });
    let sentPayload;
    const update = sinon.stub(editUserPermissions, 'ogdEditUserRoute').callsFake(async (request) => {
      sentPayload = request.body;
      return { updated: true };
    });
    const refresh = sinon.stub(refreshUserModule, 'refreshUser').resolves({});
    sinon.stub(configuration, 'showFeature').returns(true);

    await ogdUpdate(req, res);

    sinon.assert.calledOnceWithExactly(compare, req);
    sinon.assert.calledOnceWithExactly(update, req);
    expect(sentPayload).to.deep.equal({ ...userPayload, userAccessTypes: comparedAccessTypes });
    sinon.assert.calledOnceWithExactly(refresh, req);
    expect(refresh.firstCall.args[0].body).to.deep.equal({ userId: 'target-user' });
    sinon.assert.callOrder(compare, update, refresh);
    sinon.assert.calledWithExactly(res.send, { updated: true });
  });

  it('updates permissions without comparison or refresh when no access types are selected and refresh is disabled', async () => {
    const userPayload = { rolesAdd: [], rolesDelete: [], userAccessTypes: [] };
    const req = mockReq({ body: { userPayload }, params: { userId: 'target-user' } });
    const res = mockRes();
    const compare = sinon.stub(retrieveAccessTypes, 'compareAccessTypes');
    let sentPayload;
    const update = sinon.stub(editUserPermissions, 'ogdEditUserRoute').callsFake(async (request) => {
      sentPayload = request.body;
      return { updated: true };
    });
    const refresh = sinon.stub(refreshUserModule, 'refreshUser');
    sinon.stub(configuration, 'showFeature').returns(false);

    await ogdUpdate(req, res);

    sinon.assert.notCalled(compare);
    sinon.assert.calledOnceWithExactly(update, req);
    expect(sentPayload).to.deep.equal(userPayload);
    sinon.assert.notCalled(refresh);
    sinon.assert.calledWithExactly(res.send, { updated: true });
  });

  it('returns the update service error without refreshing the user', async () => {
    const req = mockReq({ body: { userPayload: { rolesAdd: [], rolesDelete: [], userAccessTypes: [] } }, params: { userId: 'target-user' } });
    const res = mockRes();
    const error = { apiError: 'Update failed', apiStatusCode: 422, message: 'Invalid permissions' };
    sinon.stub(editUserPermissions, 'ogdEditUserRoute').callsFake(async () => {
      throw error;
    });
    const refresh = sinon.stub(refreshUserModule, 'refreshUser');

    await ogdUpdate(req, res);

    sinon.assert.notCalled(refresh);
    sinon.assert.calledWithExactly(res.status, 422);
    sinon.assert.calledWithExactly(res.json, error);
  });

  it('does not update permissions when access type comparison fails', async () => {
    const req = mockReq({
      body: { orgIdsPayload: ['profile-1'], userPayload: { rolesAdd: [], rolesDelete: [], userAccessTypes: comparedAccessTypes } },
      params: { userId: 'target-user' }
    });
    const res = mockRes();
    const error = { apiError: 'Service unavailable', apiStatusCode: 503, message: 'CCD unavailable' };
    sinon.stub(retrieveAccessTypes, 'compareAccessTypes').callsFake(async () => {
      throw error;
    });
    const update = sinon.stub(editUserPermissions, 'ogdEditUserRoute');

    await ogdUpdate(req, res);

    sinon.assert.notCalled(update);
    sinon.assert.calledWithExactly(res.status, 503);
    sinon.assert.calledWithExactly(res.json, error);
  });
});
