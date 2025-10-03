import { AxiosResponse } from 'axios';
import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as crudService from '../common/crudService';
import * as configuration from '../configuration';
import { SERVICES_MCA_PROXY_API_PATH } from '../configuration/references';
import { SharedCase } from './models/case-share.model';
import { UserDetails } from './models/user-details.model';
import { assignCases } from './real-api';

chai.use(sinonChai);

describe('real-api', () => {
  const sandbox = sinon.createSandbox();
  const request = {
    body: {
      sharedCases: [
        {
          caseId: '1111222233334444',
          caseTitle: 'Case 1',
          caseTypeId: 'Test',
          sharedWith: [
            {
              idamId: 'aaaa1111',
              firstName: 'User',
              lastName: 'One',
              email: 'user.one@example.com'
            }
          ] as UserDetails[],
          pendingShares: [
            {
              idamId: 'aaaa2222',
              firstName: 'User',
              lastName: 'Two',
              email: 'user.two@example.com'
            }
          ] as UserDetails[],
          pendingUnshares: [
            {
              idamId: 'aaaa1111',
              firstName: 'User',
              lastName: 'One',
              email: 'user.one@example.com'
            }
          ] as UserDetails[]
        }
      ] as SharedCase[]
    }
  };
  const req = mockReq(request);
  const res = mockRes();
  const mockAxiosPostResponse = {
    data: {},
    config: {
      method: 'post',
      data: '{"assignee_id":"aaaa2222","case_id":"1111222233334444","case_type_id":"Test"}'
    }
  } as AxiosResponse;
  const mockAxiosDeleteResponse = {
    data: {},
    config: {
      method: 'delete',
      data: '{"assignee_id":"aaaa1111","case_id":"1111222233334444","case_type_id":"Test"}'
    }
  } as AxiosResponse;
  let handlePostStub: sinon.SinonStub;
  let handleDeleteStub: sinon.SinonStub;

  beforeEach(() => {
    handlePostStub = sandbox.stub(crudService, 'handlePost');
    handleDeleteStub = sandbox.stub(crudService, 'handleDelete');
    const configValueStub = sandbox.stub(configuration, 'getConfigValue');
    configValueStub.withArgs(SERVICES_MCA_PROXY_API_PATH).returns('ccd-service');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('assignCases', () => {
    it('should call both share case and unshare case APIs if there are no rejected responses for case sharing', async () => {
      handlePostStub.returns(Promise.resolve(mockAxiosPostResponse));
      handleDeleteStub.returns(Promise.resolve(mockAxiosDeleteResponse));
      await assignCases(req, res);
      expect(handlePostStub).to.have.been.called;
      expect(handleDeleteStub).to.have.been.called;
      expect(res.status).to.have.been.calledWith(201);
      expect(res.send).to.have.been.calledWith([
        {
          caseId: '1111222233334444',
          caseTitle: 'Case 1',
          caseTypeId: 'Test',
          sharedWith: [
            {
              idamId: 'aaaa2222',
              firstName: 'User',
              lastName: 'Two',
              email: 'user.two@example.com'
            }
          ] as UserDetails[],
          pendingShares: [] as UserDetails[],
          pendingUnshares: [] as UserDetails[]
        }
      ] as SharedCase[]);
    });

    it('should not call unshare case API if there is a rejected response for case sharing', async () => {
      handlePostStub.returns(Promise.reject(mockAxiosPostResponse as AxiosResponse));
      handleDeleteStub.returns(Promise.resolve(mockAxiosDeleteResponse as AxiosResponse));
      await assignCases(req, res);
      expect(handlePostStub).to.have.been.called;
      expect(handleDeleteStub).not.to.have.been.called;
      expect(res.status).to.have.been.calledWith(500);
      expect(res.send).to.have.been.calledWith(['{request: {"assignee_id":"aaaa2222","case_id":"1111222233334444","case_type_id":"Test"}, response: {undefined undefined}}']);
    });

    it('should return an error if there is a rejected response for case unsharing', async () => {
      handlePostStub.returns(Promise.resolve(mockAxiosPostResponse as AxiosResponse));
      handleDeleteStub.returns(Promise.reject(mockAxiosDeleteResponse as AxiosResponse));
      await assignCases(req, res);
      expect(handlePostStub).to.have.been.called;
      expect(handleDeleteStub).to.have.been.called;
      expect(res.status).to.have.been.calledWith(500);
      expect(res.send).to.have.been.calledWith(['{request: {"assignee_id":"aaaa1111","case_id":"1111222233334444","case_type_id":"Test"}, response: {undefined undefined}}']);
    });
  });
});
