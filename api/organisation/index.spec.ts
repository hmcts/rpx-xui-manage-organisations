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
import { getOrganisationDetails } from './index';
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

  it('should preserve organisation details used by the legacy API functional check', async () => {
    const organisationDetails = {
      contactInformation: [{
        addressLine1: '2',
        addressLine2: 'Leman Street',
        dxAddress: [{
          dxExchange: 'DX London',
          dxNumber: 'DX8235563323'
        }],
        townCity: 'Aldgate'
      }],
      name: 'xuiapiorganisation',
      organisationIdentifier: 'CIOWLIC',
      paymentAccount: ['PBA7853435', 'PBA4677332'],
      sraId: 'SRA34367744334',
      sraRegulated: false,
      status: 'ACTIVE'
    };
    sinon.stub(req.http, 'get').resolves({ data: organisationDetails } as AxiosResponse);

    await handleOrganisationRoute(req, res, next);

    expect(res.send).to.be.calledWith(organisationDetails);
    const sentOrganisationDetails = res.send.lastCall.args[0];
    expect(sentOrganisationDetails).to.deep.include({
      name: 'xuiapiorganisation',
      organisationIdentifier: 'CIOWLIC',
      sraId: 'SRA34367744334',
      sraRegulated: false,
      status: 'ACTIVE'
    });
    expect(sentOrganisationDetails.paymentAccount).to.deep.equal(['PBA7853435', 'PBA4677332']);
    expect(sentOrganisationDetails.contactInformation[0]).to.deep.include({
      addressLine1: '2',
      addressLine2: 'Leman Street',
      townCity: 'Aldgate'
    });
    expect(sentOrganisationDetails.contactInformation[0].dxAddress[0]).to.deep.equal({
      dxExchange: 'DX London',
      dxNumber: 'DX8235563323'
    });
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
