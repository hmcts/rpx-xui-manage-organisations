import { AxiosResponse } from 'axios';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { mockReq } from 'sinon-express-mock';
import * as configuration from '../configuration';
import { SERVICES_CCD_DEFINITION_STORE_API_PATH } from '../configuration/references';
import { http } from '../lib/http';
import { compareAccessTypes } from './index';

describe('OGD access type retrieval', () => {
  afterEach(() => sinon.restore());

  it('retrieves current access types for the supplied organisation profiles', async () => {
    const req = mockReq({
      body: {
        orgIdsPayload: ['profile-1'],
        userPayload: { userAccessTypes: [] }
      }
    });
    req.http = http(req);
    const getConfig = sinon.stub(configuration, 'getConfigValue').returns('ccd-api');
    const post = sinon.stub(req.http, 'post').resolves({
      data: {
        jurisdictions: [{
          jurisdictionId: 'civil-jurisdiction',
          accessTypes: [{
            organisationProfileId: 'profile-1',
            accessTypeId: 'standard-type',
            accessDefault: true,
            display: true
          }]
        }]
      }
    } as AxiosResponse);

    const result = await compareAccessTypes(req);

    sinon.assert.calledWithExactly(getConfig, SERVICES_CCD_DEFINITION_STORE_API_PATH);
    sinon.assert.calledOnceWithExactly(post, 'ccd-api/retrieve-access-types', {
      organisationProfileIds: ['profile-1']
    });
    expect(result.userAccessTypes).to.deep.equal([{
      jurisdictionId: 'civil-jurisdiction',
      organisationProfileId: 'profile-1',
      accessTypeId: 'standard-type',
      enabled: true
    }]);
  });

  it('propagates retrieval failures as an API error report', async () => {
    const req = mockReq({ body: { orgIdsPayload: ['profile-1'], userPayload: { userAccessTypes: [] } } });
    req.http = http(req);
    sinon.stub(configuration, 'getConfigValue').returns('ccd-api');
    const upstreamError = {
      data: { errorDescription: 'CCD unavailable', errorMessage: 'Service unavailable' },
      status: 503
    };
    sinon.stub(req.http, 'post').callsFake(async () => {
      throw upstreamError;
    });

    try {
      await compareAccessTypes(req);
      expect.fail('Expected access type retrieval to reject');
    } catch (error) {
      expect(error).to.deep.equal({
        apiError: 'Service unavailable',
        apiStatusCode: 503,
        message: 'CCD unavailable'
      });
    }
  });
});
