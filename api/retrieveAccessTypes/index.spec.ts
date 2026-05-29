import { AxiosResponse } from 'axios';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as configuration from '../configuration';
import { SERVICES_CCD_DEFINITION_STORE_API_PATH } from '../configuration/references';
import { compareAccessTypes, handleRetrieveAccessTypes } from './index';

describe('retrieveAccessTypes index', () => {
  let req: any;
  let res: any;
  let postStub: sinon.SinonStub;

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
          }
        ]
      }
    ]
  };

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    postStub = sinon.stub();
    req.http = {
      post: postStub
    };
    sinon.stub(configuration, 'getConfigValue').returns('ccd-definition-api');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('posts organisation profile IDs to CCD definition store and returns access types', async () => {
    const payload = { organisationProfileIds: ['SOLICITOR_PROFILE'] };
    req.body = payload;
    postStub.resolves({ data: accessTypesResponse } as AxiosResponse);

    await handleRetrieveAccessTypes(req, res);

    sinon.assert.calledWith(configuration.getConfigValue as sinon.SinonStub, SERVICES_CCD_DEFINITION_STORE_API_PATH);
    sinon.assert.calledWith(postStub, 'ccd-definition-api/retrieve-access-types', payload);
    sinon.assert.calledWith(res.send, accessTypesResponse);
  });

  it('returns a structured API error when CCD definition store fails', async () => {
    req.body = { organisationProfileIds: ['SOLICITOR_PROFILE'] };
    postStub.rejects({
      data: {
        errorDescription: 'CCD access types unavailable',
        errorMessage: 'Service unavailable'
      },
      status: 503
    });

    await handleRetrieveAccessTypes(req, res);

    sinon.assert.calledWith(res.status, 503);
    sinon.assert.calledWith(res.send, {
      apiError: 'Service unavailable',
      apiStatusCode: 503,
      message: 'CCD access types unavailable'
    });
  });

  it('compares submitted user access types against latest CCD access types', async () => {
    req.body = {
      orgIdsPayload: ['SOLICITOR_PROFILE'],
      userPayload: {
        userAccessTypes: [
          {
            accessTypeId: 'CIVIL_STANDARD',
            enabled: true,
            jurisdictionId: 'CIVIL',
            organisationProfileId: 'SOLICITOR_PROFILE'
          }
        ]
      }
    };
    postStub.resolves({ data: accessTypesResponse } as AxiosResponse);

    const result = await compareAccessTypes(req);

    sinon.assert.calledWith(postStub, 'ccd-definition-api/retrieve-access-types', {
      organisationProfileIds: ['SOLICITOR_PROFILE']
    });
    expect(result).to.deep.equal({
      userAccessTypes: [
        {
          accessTypeId: 'CIVIL_STANDARD',
          enabled: true,
          jurisdictionId: 'CIVIL',
          organisationProfileId: 'SOLICITOR_PROFILE'
        }
      ]
    });
  });

  it('rejects compare-access-types when CCD definition store fails', async () => {
    req.body = {
      orgIdsPayload: ['SOLICITOR_PROFILE'],
      userPayload: {
        userAccessTypes: []
      }
    };
    postStub.rejects({
      data: {
        errorDescription: 'CCD access types unavailable',
        errorMessage: 'Service unavailable'
      },
      status: 503
    });

    try {
      await compareAccessTypes(req);
      expect.fail('Expected compareAccessTypes to reject');
    } catch (error) {
      expect(error).to.deep.equal({
        apiError: 'Service unavailable',
        apiStatusCode: 503,
        message: 'CCD access types unavailable'
      });
    }
  });
});
