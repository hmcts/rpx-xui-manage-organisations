import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { NextFunction, Response } from 'express';
import { EnhancedRequest } from '../lib/models';
import { organisationTypes } from './mockOrganisationTypes';
import { getRegulatoryOrganisationTypes } from './index';

chai.use(sinonChai);

describe('getRegulatoryOrganisationTypes', () => {
  let req: EnhancedRequest;
  let res: Response;
  let next: NextFunction;
  let sandbox: sinon.SinonSandbox;

  const createMockResponse = (): Response => {
    const mockRes = {
      status: sandbox.stub().returnsThis(),
      send: sandbox.stub().returnsThis(),
      json: sandbox.stub().returnsThis(),
      end: sandbox.stub().returnsThis()
    } as unknown as Response;
    return mockRes;
  };

  const createMockRequest = (): EnhancedRequest => {
    return {} as EnhancedRequest;
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = createMockRequest();
    res = createMockResponse();
    next = sandbox.spy() as NextFunction;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('successful response', () => {
    it('should return organisationTypes with HTTP 200 status', async () => {
      await getRegulatoryOrganisationTypes(req, res, next);

      expect(res.status).to.have.been.calledOnceWith(200);
      expect(res.send).to.have.been.calledOnceWith(organisationTypes);
      expect(next).not.to.have.been.called;
    });

    it('should call res.status and res.send in correct order', async () => {
      await getRegulatoryOrganisationTypes(req, res, next);

      expect(res.status).to.have.been.calledBefore(res.send as sinon.SinonStub);
    });
  });

  describe('error handling', () => {
    it('should call next with error when res.status throws', async () => {
      const error = new Error('Status error');
      (res.status as sinon.SinonStub).throws(error);

      await getRegulatoryOrganisationTypes(req, res, next);

      expect(next).to.have.been.calledOnceWith(error);
      expect(res.send).not.to.have.been.called;
    });

    it('should call next with error when res.send throws', async () => {
      const error = new Error('Send error');
      (res.send as sinon.SinonStub).throws(error);

      await getRegulatoryOrganisationTypes(req, res, next);

      expect(next).to.have.been.calledOnceWith(error);
    });


  });

  describe('response data', () => {
    it('should return the expected organisation types data structure', async () => {
      await getRegulatoryOrganisationTypes(req, res, next);

      const sentData = (res.send as sinon.SinonStub).getCall(0).args[0];
      expect(sentData).to.equal(organisationTypes);
      expect(sentData).to.be.an('array');
    });
  });
});
