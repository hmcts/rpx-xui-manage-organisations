import axios from 'axios';
import { AxiosInstance } from 'axios';
import { AxiosResponse } from 'axios';
import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as configuration from '../configuration';
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import { http } from '../lib/http';
import * as log4jui from '../lib/log4jui';
import { getOrganisationDetails, router } from './index';
import { handleOrganisationRoute } from './index';

chai.use(sinonChai);

describe('organisation index', () => {
  const req = mockReq();
  req.http = http(req);
  const res = mockRes();
  const next = sinon.stub();

  beforeEach(() => {
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

/* describe('organisation contact-information update', () => {
  const limits = {
    uprn: 14,
    addressLine1: 150,
    addressLine2: 150,
    addressLine3: 50,
    townCity: 50,
    county: 50,
    country: 50,
    postCode: 14,
    dxNumber: 13,
    dxExchange: 40
  };
  let req;
  let res;
  let next;
  let put;

  beforeEach(() => {
    sinon.stub(configuration, 'getConfigValue').returns('https://rd.example.test');
    put = sinon.stub().resolves({ status: 204 });
    req = mockReq({
      body: { addressLine1: '102 Example Road' },
      headers: {},
      http: { put },
      session: { auth: { roles: ['pui-organisation-manager'] } }
    });
    res = mockRes();
    next = sinon.stub();
  });

  afterEach(() => sinon.restore());

  it('mounts the PUT on the existing organisation router', () => {
    const route = router.stack.find((layer) => layer.route?.path === '/contact-information');
    expect(route?.route.stack[0].method).to.equal('put');
    expect(route?.route.stack[0].handle).to.equal(handleUpdateContactInformationRoute);
  });

  it('forwards the flat payload through the request client without adding an organisation ID or overriding auth', async () => {
    req.body = { addressLine1: '102 Example Road', postCode: 'SW1 1AA', dxNumber: 'DX 123', dxExchange: 'DX Exchange' };
    await handleUpdateContactInformationRoute(req, res, next);
    expect(configuration.getConfigValue).to.have.been.calledWith(SERVICES_RD_PROFESSIONAL_API_PATH);
    expect(put).to.have.been.calledOnceWithExactly(
      'https://rd.example.test/refdata/external/v2/organisations/contactinformation', req.body
    );
    expect(res.status).to.have.been.calledWith(204);
    expect(res.end).to.have.been.calledOnce;
    expect(res.send).not.to.have.been.called;
    expect(next).not.to.have.been.called;
  });

  it('preserves the existing bearer and service identity through the real request client', async () => {
    sinon.stub(log4jui, 'getLogger').returns({ info: sinon.stub(), trackRequest: sinon.stub() } as any);
    req.headers = {
      Authorization: 'Bearer synthetic-user-token',
      ServiceAuthorization: 'synthetic-service-token',
      'user-roles': 'pui-organisation-manager'
    };
    req.http = http(req);
    const adapter = sinon.stub().callsFake(async (config) => {
      expect(config.headers.Authorization).to.equal(req.headers.Authorization);
      expect(config.headers.ServiceAuthorization).to.equal(req.headers.ServiceAuthorization);
      expect(config.headers['user-roles']).to.equal(req.headers['user-roles']);
      expect(config.method).to.equal('put');
      expect(config.url).to.equal('https://rd.example.test/refdata/external/v2/organisations/contactinformation');
      expect(JSON.parse(config.data)).to.deep.equal(req.body);
      return { config, data: '', headers: {}, status: 204, statusText: 'No Content' };
    });
    req.http.defaults.adapter = adapter;

    await handleUpdateContactInformationRoute(req, res, next);

    expect(adapter).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(204);
    expect(next).not.to.have.been.called;
  });

  for (const session of [undefined, {}, { auth: null }]) {
    it(`rejects a missing authenticated session (${JSON.stringify(session)}) before forwarding`, async () => {
      req.session = session;
      await handleUpdateContactInformationRoute(req, res, next);
      expect(res.status).to.have.been.calledWith(401);
      expect(put).not.to.have.been.called;
    });
  }

  for (const roles of [undefined, [], ['pui-finance-manager'], ['organisation-manager'], 'pui-organisation-manager']) {
    it(`rejects noncanonical or malformed roles (${JSON.stringify(roles)}) before forwarding`, async () => {
      req.session.auth.roles = roles;
      req.headers['user-roles'] = 'pui-organisation-manager';
      await handleUpdateContactInformationRoute(req, res, next);
      expect(res.status).to.have.been.calledWith(403);
      expect(put).not.to.have.been.called;
    });
  }

  const invalidBodies: unknown[] = [
    undefined, null, [], 'address', 42, {},
    { addressLine1: '' }, { addressLine1: ' \t\n' }, { addressLine1: null }, { addressLine1: 123 },
    { addressLine1: 'Example', orgId: 'another-organisation' },
    { addressLine1: 'Example', contactInformation: [] },
    { addressLine1: 'Example', dxAddress: [] },
    { addressLine1: 'Example', unknown: 'value' },
    { addressLine1: 'Example', toString: 'value' }
  ];
  invalidBodies.forEach((body, index) => {
    it(`rejects malformed or unknown request content ${index + 1} before forwarding`, async () => {
      req.body = body;
      await handleUpdateContactInformationRoute(req, res, next);
      expect(res.status).to.have.been.calledWith(400);
      expect(put).not.to.have.been.called;
    });
  });

  it('accepts an address with both DX fields omitted', async () => {
    await handleUpdateContactInformationRoute(req, res, next);
    expect(put).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledWith(204);
  });

  for (const missing of ['dxNumber', 'dxExchange']) {
    it(`rejects a DX pair missing ${missing}`, async () => {
      req.body = { addressLine1: 'Example', dxNumber: 'DX 123', dxExchange: 'Example' };
      delete req.body[missing];
      await handleUpdateContactInformationRoute(req, res, next);
      expect(res.status).to.have.been.calledWith(400);
      expect(put).not.to.have.been.called;
    });
  }

  for (const [field, max] of Object.entries(limits)) {
    it(`accepts ${field} at its inclusive maximum of ${max}`, async () => {
      req.body = { addressLine1: 'Example', dxNumber: 'DX 123', dxExchange: 'Example', [field]: 'a'.repeat(max) };
      await handleUpdateContactInformationRoute(req, res, next);
      expect(put).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(204);
    });

    for (const value of ['a'.repeat(max + 1), '', ' \t', null, undefined, 123, [], {}]) {
      it(`rejects invalid ${field}: ${JSON.stringify(value)}`, async () => {
        req.body = { addressLine1: 'Example', dxNumber: 'DX 123', dxExchange: 'Example', [field]: value };
        await handleUpdateContactInformationRoute(req, res, next);
        expect(res.status).to.have.been.calledWith(400);
        expect(put).not.to.have.been.called;
      });
    }
  }

  for (const status of [400, 401, 403, 500, 502]) {
    it(`preserves the upstream ${status} status and data for ordinary error handling`, async () => {
      const error = { status, data: { message: 'Synthetic provider error' } };
      put.rejects(error);
      await handleUpdateContactInformationRoute(req, res, next);
      expect(next).to.have.been.calledOnceWithExactly(error);
      expect(res.status).not.to.have.been.called;
      expect(res.end).not.to.have.been.called;
    });
  }

  for (const error of [new Error('Synthetic network failure'), { status: 0, data: 'Synthetic transport detail' }]) {
    it(`returns a bad gateway for a transport error (${JSON.stringify(error)}) without exposing its details`, async () => {
      put.rejects(error);
      await handleUpdateContactInformationRoute(req, res, next);
      expect(next).to.have.been.calledOnceWithExactly({
        status: 502, data: { message: 'Organisation update service unavailable' }
      });
      expect(res.end).not.to.have.been.called;
    });
  }

  for (const status of [200, 201, 202, 205, 206]) {
    it(`rejects unexpected success status ${status} as a bad gateway`, async () => {
      put.resolves({ status });
      await handleUpdateContactInformationRoute(req, res, next);
      expect(next).to.have.been.calledOnceWithExactly({
        status: 502, data: { message: 'Unexpected organisation update response' }
      });
      expect(res.end).not.to.have.been.called;
    });
  }
}); */
