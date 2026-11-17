import { expect } from 'chai';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as configuration from '../configuration';
import { ogdUpdate } from '../ogd';
import * as retrieveAccessTypes from '../retrieveAccessTypes';
import { inviteUserRoute, ogdEditUserRoute } from './index';

describe('Permissions update integrity', () => {
  const userId = 'target-user';
  const storedUser = {
    userIdentifier: userId, email: 'stored@example.invalid',
    firstName: 'Original', lastName: 'Name', idamStatus: 'ACTIVE'
  };
  const access = {
    jurisdictionId: 'CIVIL', organisationProfileId: 'profile', accessTypeId: 'standard', enabled: true
  };
  const changes = {
    rolesAdd: [{ name: 'pui-case-manager' }], rolesDelete: [], userAccessTypes: [access]
  };
  let req;
  let res;
  let get;
  let put;

  beforeEach(() => {
    sinon.stub(configuration, 'getConfigValue').returns('https://refdata.invalid');
    sinon.stub(configuration, 'showFeature').returns(false);
    get = sinon.stub().resolves({ data: { users: [storedUser] } });
    put = sinon.stub().resolves({ data: { updated: true } });
    req = mockReq({
      params: { userId }, http: { get, put },
      body: {
        ...changes, id: 'another-user', email: 'attacker@example.invalid',
        firstName: 'Tampered', lastName: 'Tampered', idamStatus: 'SUSPENDED', unexpected: true
      }
    });
    res = mockRes();
  });

  afterEach(() => sinon.restore());

  function assertProtectedUpdate() {
    sinon.assert.calledOnceWithExactly(get,
      'https://refdata.invalid/refdata/external/v1/organisations/users?returnRoles=true&userIdentifier=target-user');
    sinon.assert.calledOnceWithExactly(put,
      'https://refdata.invalid/refdata/external/v1/organisations/users/target-user', {
        id: userId, email: storedUser.email, firstName: storedUser.firstName,
        lastName: storedUser.lastName, idamStatus: storedUser.idamStatus, ...changes
      });
    sinon.assert.callOrder(get, put);
  }

  it('uses stored personal details and preserves permitted updates on the standard route', async () => {
    await inviteUserRoute(req, res);
    assertProtectedUpdate();
    sinon.assert.calledWithExactly(res.send, { updated: true });
  });

  it('protects the shared OGD update handler', async () => {
    expect(await ogdEditUserRoute(req)).to.deep.equal({ updated: true });
    assertProtectedUpdate();
  });

  for (const withAccessTypes of [true, false]) {
    it(`protects the complete OGD flow with access types ${withAccessTypes}`, async () => {
      req.body = { userPayload: { ...req.body, userAccessTypes: withAccessTypes ? [access] : [] } };
      const compare = sinon.stub(retrieveAccessTypes, 'compareAccessTypes').resolves({
        userAccessTypes: [access], firstName: 'Also tampered'
      });
      await ogdUpdate(req, res);
      sinon.assert.calledOnce(put);
      expect(put.firstCall.args[1].firstName).to.equal(storedUser.firstName);
      expect(put.firstCall.args[1].lastName).to.equal(storedUser.lastName);
      expect(put.firstCall.args[1].userAccessTypes).to.deep.equal(withAccessTypes ? [access] : []);
      expect(compare.called).to.equal(withAccessTypes);
      sinon.assert.calledWithExactly(res.send, { updated: true });
    });
  }

  it('drops extra properties within permitted collections', async () => {
    req.body.rolesAdd = [{ name: 'pui-case-manager', firstName: 'Tampered' }];
    req.body.userAccessTypes = [{ ...access, lastName: 'Tampered' }];
    await inviteUserRoute(req, res);
    assertProtectedUpdate();
  });

  for (const users of [[], [{ ...storedUser, userIdentifier: 'another-user' }], [storedUser, storedUser]]) {
    it('fails closed when the lookup does not identify one matching user', async () => {
      get.resolves({ data: { users } });
      await inviteUserRoute(req, res);
      sinon.assert.notCalled(put);
      sinon.assert.calledWithExactly(res.status, 404);
    });
  }

  it('fails closed when personal details are incomplete', async () => {
    get.resolves({ data: { users: [{ ...storedUser, firstName: undefined }] } });
    await inviteUserRoute(req, res);
    sinon.assert.notCalled(put);
    sinon.assert.calledWithExactly(res.status, 502);
  });

  it('does not update when the authenticated lookup is forbidden', async () => {
    get.rejects({ status: 403, data: { message: 'Forbidden' } });
    await inviteUserRoute(req, res);
    sinon.assert.notCalled(put);
    sinon.assert.calledWithExactly(res.status, 403);
  });

  it('propagates lookup failure through the OGD handler without updating', async () => {
    get.rejects({ status: 403, data: { message: 'Forbidden' } });
    try {
      await ogdEditUserRoute(req);
      expect.fail('Expected update to fail');
    } catch (error) {
      expect(error.apiStatusCode).to.equal(403);
    }
    sinon.assert.notCalled(put);
  });

  for (const invalid of [null, [], { rolesAdd: 'invalid' }, { rolesDelete: [null] }, { userAccessTypes: [{}] }]) {
    it('rejects malformed editable data without making an update', async () => {
      req.body = invalid;
      await inviteUserRoute(req, res);
      sinon.assert.notCalled(put);
      sinon.assert.calledWithExactly(res.status, 400);
    });
  }
});
