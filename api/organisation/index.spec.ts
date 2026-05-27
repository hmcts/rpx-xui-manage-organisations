import axios from 'axios';
import { AxiosInstance } from 'axios';
import { AxiosResponse } from 'axios';
import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as configuration from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import { http } from '../lib/http';
import { getOrganisationDetails, handleOrganisationRoute, handleOrganisationUsersRoute, handleOrganisationV1Route } from './index';

chai.use(sinonChai);

describe('organisation index', () => {
  const req = mockReq();
  req.http = http(req);
  const res = mockRes();
  const next = sinon.stub();

  beforeEach(() => {
    res.send.resetHistory();
    res.status.resetHistory();
    next.resetHistory();
    req.query = { currentUserEmail: 'current.user@example.com' };
    sinon.stub(console, 'log');
    sinon.stub(configuration, 'getConfigValue').returns('apiPath');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return Organisation data and send it in an HTTP response', async () => {
    // Stub the http.get call to return a mock response
    const mockAxiosResponse = {
      data: 'test'
    };
    sinon.stub(req.http, 'get').resolves(mockAxiosResponse as AxiosResponse);

    // Test the function and check expectations
    await handleOrganisationRoute(req, res, next);
    expect(configuration.getConfigValue).to.be.calledWith(SERVICES_RD_PROFESSIONAL_API_PATH);
    expect(req.http.get).to.be.calledWith('apiPath/refdata/external/v2/organisations');
    expect(res.send).to.be.calledWith('test');
  });

  it('should return an HTTP error response', async () => {
    // Stub the http.get call to throw an exception
    const errorMessage = 'Something went wrong';
    const errorCode = 599;
    const error = {
      data: {
        message: errorMessage
      },
      status: errorCode
    };
    sinon.stub(req.http, 'get').throws(error);

    // Test the function and check expectations
    await handleOrganisationRoute(req, res, next);
    expect(next).to.be.calledWith(error);
  });

  it('should reject unsafe organisation v2 data', async () => {
    sinon.stub(req.http, 'get').resolves({
      data: {
        organisationIdentifier: '<script>alert("unsafe")</script>'
      }
    } as AxiosResponse);

    await handleOrganisationRoute(req, res, next);

    expect(res.status).to.be.calledWith(400);
    expect(res.status.calledBefore(res.send)).to.equal(true);
    expect(res.send).to.be.calledWith('Invalid organisation data');
  });

  it('should return Organisation v1 data and send it in an HTTP response', async () => {
    const mockAxiosResponse = {
      data: {
        organisationIdentifier: 'ORG1'
      }
    };
    sinon.stub(req.http, 'get').resolves(mockAxiosResponse as AxiosResponse);

    await handleOrganisationV1Route(req, res, next);

    expect(configuration.getConfigValue).to.be.calledWith(SERVICES_RD_PROFESSIONAL_API_PATH);
    expect(req.http.get).to.be.calledWith('apiPath/refdata/external/v1/organisations');
    expect(res.send).to.be.calledWith(mockAxiosResponse.data);
  });

  it('should reject unsafe organisation v1 data', async () => {
    sinon.stub(req.http, 'get').resolves({
      data: {
        name: 'javascript:alert("unsafe")'
      }
    } as AxiosResponse);

    await handleOrganisationV1Route(req, res, next);

    expect(res.status).to.be.calledWith(400);
    expect(res.status.calledBefore(res.send)).to.equal(true);
    expect(res.send).to.be.calledWith('Invalid organisation data');
  });

  it('should pass organisation v1 errors to next', async () => {
    const error = { status: 500, data: { message: 'failed' } };
    sinon.stub(req.http, 'get').throws(error);

    await handleOrganisationV1Route(req, res, next);

    expect(next).to.be.calledWith(error);
  });

  it('should return only active organisation users', async () => {
    sinon.stub(req.http, 'get').resolves({
      data: {
        users: [
          { idamStatus: 'ACTIVE', email: 'active@example.com' },
          { idamStatus: 'PENDING', email: 'pending@example.com' },
          { idamStatus: 'SUSPENDED', email: 'suspended@example.com' }
        ]
      }
    } as AxiosResponse);

    await handleOrganisationUsersRoute(req, res, next);

    expect(req.http.get).to.be.calledWith('apiPath/refdata/external/v1/organisations/users?returnRoles=false');
    expect(res.send).to.be.calledWith([
      { idamStatus: 'ACTIVE', email: 'active@example.com' }
    ]);
  });

  it('should pass organisation users errors to next', async () => {
    const error = { status: 503, data: { message: 'unavailable' } };
    sinon.stub(req.http, 'get').throws(error);

    await handleOrganisationUsersRoute(req, res, next);

    expect(next).to.be.calledWith(error);
  });

  it('should get the Organisation details', () => {
    // Ensure that when getOrganisationDetails() calls http(req), its axios.create() function call returns a fake AxiosInstance
    const fakeAxiosInstance = {
      get: sinon.stub(),
      interceptors: {
        request: {
          use: sinon.stub()
        },
        response: {
          use: sinon.stub()
        }
      }
    } as unknown as AxiosInstance;
    sinon.stub(axios, 'create').returns(fakeAxiosInstance);
    getOrganisationDetails(req, 'http://local');
    // expect(fakeAxiosInstance.get).to.be.calledWith('http://local/refdata/external/v1/organisations')
  });
});
