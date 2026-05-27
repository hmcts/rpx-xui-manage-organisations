import { AxiosResponse } from 'axios';
import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as crudService from '../common/crudService';
import * as configuration from '../configuration';
import { SERVICES_MCA_PROXY_API_PATH, SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references';
import { SharedCase } from './models/case-share.model';
import { UserDetails } from './models/user-details.model';
import { assignCases, getCases, getUsers } from './real-api';

const sinonChaiPlugin = (sinonChai as unknown as { default?: Chai.ChaiPlugin }).default ??
  (sinonChai as unknown as Chai.ChaiPlugin);

chai.use(sinonChaiPlugin);

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
  let handleGetStub: sinon.SinonStub;

  beforeEach(() => {
    res.send.resetHistory();
    res.status.resetHistory();
    handleGetStub = sandbox.stub(crudService, 'handleGet');
    handlePostStub = sandbox.stub(crudService, 'handlePost');
    handleDeleteStub = sandbox.stub(crudService, 'handleDelete');
    const configValueStub = sandbox.stub(configuration, 'getConfigValue');
    configValueStub.withArgs(SERVICES_MCA_PROXY_API_PATH).returns('ccd-service');
    configValueStub.withArgs(SERVICES_RD_PROFESSIONAL_API_PATH).returns('prd-service');
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

    it('should not call unshare case API if one of multiple case sharing responses is rejected', async () => {
      const rejectedPendingShare = {
        idamId: 'aaaa3333',
        firstName: 'User',
        lastName: 'Three',
        email: 'user.three@example.com'
      } as UserDetails;
      const partialFailureReq = mockReq({
        body: {
          sharedCases: [
            {
              ...request.body.sharedCases[0],
              pendingShares: [
                request.body.sharedCases[0].pendingShares[0],
                rejectedPendingShare
              ]
            }
          ] as SharedCase[]
        }
      });
      const rejectedPostResponse = {
        data: {
          status: 409,
          message: 'Case share failed'
        },
        config: {
          method: 'post',
          data: '{"assignee_id":"aaaa3333","case_id":"1111222233334444","case_type_id":"Test"}'
        }
      } as AxiosResponse;

      handlePostStub.onFirstCall().returns(Promise.resolve(mockAxiosPostResponse));
      handlePostStub.onSecondCall().returns(Promise.reject(rejectedPostResponse));
      handleDeleteStub.returns(Promise.resolve(mockAxiosDeleteResponse as AxiosResponse));

      await assignCases(partialFailureReq, res);

      expect(handlePostStub).to.have.been.calledTwice;
      expect(handleDeleteStub).not.to.have.been.called;
      expect(res.status).to.have.been.calledWith(201);
      expect(res.send).to.have.been.calledWith([
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
            },
            {
              idamId: 'aaaa2222',
              firstName: 'User',
              lastName: 'Two',
              email: 'user.two@example.com'
            }
          ] as UserDetails[],
          pendingShares: [rejectedPendingShare],
          pendingUnshares: [
            {
              idamId: 'aaaa1111',
              firstName: 'User',
              lastName: 'One',
              email: 'user.one@example.com'
            }
          ] as UserDetails[]
        }
      ] as SharedCase[]);
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

    it('should return unchanged cases when there are no pending shares or unshares', async () => {
      const unchangedCase = {
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
        pendingShares: [] as UserDetails[],
        pendingUnshares: [] as UserDetails[]
      } as SharedCase;
      const noChangeReq = mockReq({
        body: {
          sharedCases: [unchangedCase]
        }
      });

      await assignCases(noChangeReq, res);

      expect(handlePostStub).not.to.have.been.called;
      expect(handleDeleteStub).not.to.have.been.called;
      expect(res.status).to.have.been.calledWith(201);
      expect(res.send).to.have.been.calledWith([unchangedCase]);
    });
  });

  describe('getUsers', () => {
    it('should map PRD users to case-share user details', async () => {
      handleGetStub.resolves({
        status: 200,
        data: {
          users: [
            {
              userIdentifier: 'idam-1',
              firstName: 'User',
              lastName: 'One',
              email: 'user.one@example.com'
            }
          ]
        }
      });
      const next = sandbox.stub();

      await getUsers(req, res, next);

      expect(handleGetStub).to.have.been.called;
      expect(handleGetStub.firstCall.args[0]).to.equal('prd-service/refdata/external/v1/organisations/users?returnRoles=false&status=active');
      expect(res.status).to.have.been.calledWith(200);
      expect(res.send).to.have.been.calledWith([
        {
          idamId: 'idam-1',
          firstName: 'User',
          lastName: 'One',
          email: 'user.one@example.com'
        }
      ]);
    });

    it('should pass getUsers errors to next', async () => {
      const error = new Error('PRD unavailable');
      const next = sandbox.stub();
      handleGetStub.rejects(error);

      await getUsers(req, res, next);

      expect(next).to.have.been.calledWith(error);
    });
  });

  describe('getCases', () => {
    it('should map CCD case assignments to shared cases', async () => {
      handleGetStub.resolves({
        status: 200,
        data: {
          case_assignments: [
            {
              case_id: '1111222233334444',
              case_title: 'Case 1',
              shared_with: [
                {
                  idam_id: 'idam-1',
                  first_name: 'User',
                  last_name: 'One',
                  email: 'user.one@example.com',
                  case_roles: ['[CREATOR]']
                }
              ]
            }
          ]
        }
      });
      const next = sandbox.stub();
      const casesReq = mockReq({
        query: {
          case_ids: '1111222233334444'
        }
      });

      await getCases(casesReq, res, next);

      expect(handleGetStub).to.have.been.called;
      expect(handleGetStub.firstCall.args[0]).to.equal('ccd-service/case-assignments?case_ids=1111222233334444');
      expect(res.status).to.have.been.calledWith(200);
      expect(res.send).to.have.been.calledWith([
        {
          caseId: '1111222233334444',
          caseTitle: 'Case 1',
          sharedWith: [
            {
              idamId: 'idam-1',
              firstName: 'User',
              lastName: 'One',
              email: 'user.one@example.com',
              caseRoles: ['[CREATOR]']
            }
          ]
        }
      ]);
    });

    it('should pass getCases errors to next', async () => {
      const error = new Error('CCD unavailable');
      const next = sandbox.stub();
      handleGetStub.rejects(error);

      await getCases(mockReq({ query: { case_ids: '1111222233334444' } }), res, next);

      expect(next).to.have.been.calledWith(error);
    });
  });
});
