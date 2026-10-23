import { expect } from 'chai';
import { MatchersV3 } from '@pact-foundation/pact';
import { consumerRequest } from '../settings/consumer-request';
import { PactV3TestSetup } from '../settings/provider.mock';
import { shareCasesReducer } from '../../../../../src/cases/store/reducers/share-case.reducer';
import { LoadShareCasesSuccess } from '../../../../../src/cases/store/actions/share-case.action';

const { like: somethingLike } = MatchersV3;
const pactSetUp = new PactV3TestSetup({ provider: 'acc_manageCaseAssignment', port: 8000 });

describe('Get cases from acc', () => {
  let context: ReturnType<typeof consumerRequest>;
  before(async () => {
    pactSetUp.provider.addInteraction({
      states: [{ description: 'Get list of cases' }],
      uponReceiving: 'A list of case ids',
      withRequest: {
        method: 'GET',
        path: '/case-assignments',
        query: { case_ids: '123456789' },
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer some-access-token',
          ServiceAuthorization: 'serviceAuthToken'
        }
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { case_assignments: [{
          case_id: somethingLike('123456789'),
          case_title: somethingLike('Case 1'),
          shared_with: [{
            case_roles: somethingLike([]),
            email: somethingLike('test@email.com'),
            first_name: somethingLike('Joe'),
            idam_id: somethingLike('a123456789'),
            last_name: somethingLike('Smith')
          }]
        }] }
      }
    });
  });
  after(async () => {
    context?.restore();
  });
  it('loads assignments through the production client and preserves the selected title', async () => {
    await pactSetUp.provider.executeTest(async (mockServer) => {
      context = consumerRequest(mockServer.url, { case_ids: '123456789' });
      const { getCases } = context.load('../../../../caseshare/real-api');
      await getCases(context.req, context.res, context.next);
      expect(context.next.called).to.equal(false);
      const dto = context.rawResponse.case_assignments;
      expect(dto).to.be.not.null;
      expect(dto[0].case_id).to.equal('123456789');
      expect(dto[0].case_title).to.equal('Case 1');
      expect(dto[0].shared_with[0].case_roles).to.deep.equal([]);
      expect(dto[0].shared_with[0].first_name).to.equal('Joe');
      const sharedCases = context.sent.firstCall.args[0];
      expect(sharedCases[0].caseId).to.equal('123456789');
      expect(sharedCases[0].caseTitle).to.equal('Case 1');
      expect(sharedCases[0].sharedWith[0].firstName).to.equal('Joe');
      const state = shareCasesReducer({
        shareCases: [{ caseId: '123456789', caseTitle: 'Case 1' }],
        loading: true, error: undefined, users: []
      }, new LoadShareCasesSuccess(sharedCases));
      expect(state.shareCases[0].caseTitle).to.equal('Case 1');
    });
  });
});
